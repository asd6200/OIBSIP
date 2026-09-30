const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { notifyOrderStatusChange } = require('../services/socketService');
const { checkLowStockAndNotify } = require('../services/stockCron');

// Initialize Razorpay instance
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Helper to decrement stock for items in order
const decrementInventory = async (items) => {
  for (const item of items) {
    if (item.isCustom && item.customDetails) {
      const { base, sauce, cheese, veggies } = item.customDetails;
      if (base) await Inventory.updateOne({ name: base }, { $inc: { stock: -1 * (item.quantity || 1) } });
      if (sauce) await Inventory.updateOne({ name: sauce }, { $inc: { stock: -1 * (item.quantity || 1) } });
      if (cheese) await Inventory.updateOne({ name: cheese }, { $inc: { stock: -1 * (item.quantity || 1) } });
      if (veggies && Array.isArray(veggies)) {
        for (const veg of veggies) {
          await Inventory.updateOne({ name: veg }, { $inc: { stock: -1 * (item.quantity || 1) } });
        }
      }
    } else {
      // Preset pizza decrement
      const baseName = item.crust || 'Hand Tossed';
      await Inventory.updateOne({ name: baseName }, { $inc: { stock: -1 * (item.quantity || 1) } });
      await Inventory.updateOne({ name: 'Classic Tomato' }, { $inc: { stock: -1 * (item.quantity || 1) } });
      await Inventory.updateOne({ name: 'Mozzarella Cheese' }, { $inc: { stock: -1 * (item.quantity || 1) } });
    }
  }

  // Check if any item fell below threshold after decrement
  await checkLowStockAndNotify();
};

// Create Order (Initialize Razorpay or COD)
const createOrder = async (req, res) => {
  try {
    const {
      items,
      quickAddons,
      subTotal,
      gst,
      discount,
      walletPointsRedeemed,
      grandTotal,
      orderType,
      deliveryAddress,
      contactNumber,
      remarks,
      paymentMethod,
    } = req.body;

    const hasItems = (items && items.length > 0) || (quickAddons && quickAddons.length > 0);
    if (!hasItems) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (grandTotal < 199) {
      return res.status(400).json({ message: 'Minimum order amount is ₹199' });
    }

    // Handle wallet deduction if redeemed
    if (walletPointsRedeemed && walletPointsRedeemed > 0) {
      const user = await User.findById(req.user._id);
      if (user.walletPoints < walletPointsRedeemed) {
        return res.status(400).json({ message: 'Insufficient wallet points' });
      }
      user.walletPoints -= walletPointsRedeemed;
      await user.save();
    }

    let razorpayOrderId = null;

    if (paymentMethod === 'Online') {
      if (razorpayInstance) {
        const options = {
          amount: Math.round(grandTotal * 100), // in paise
          currency: 'INR',
          receipt: `receipt_order_${Date.now()}`,
        };
        const rzpOrder = await razorpayInstance.orders.create(options);
        razorpayOrderId = rzpOrder.id;
      } else {
        // Dev / Simulation mode Razorpay order ID
        razorpayOrderId = `rzp_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }
    }

    const order = new Order({
      user: req.user._id,
      items,
      quickAddons: quickAddons || [],
      subTotal,
      gst,
      discount: discount || 0,
      walletPointsRedeemed: walletPointsRedeemed || 0,
      grandTotal,
      orderType: orderType || 'Delivery',
      deliveryAddress: deliveryAddress || req.user.address,
      contactNumber: contactNumber || req.user.phone || '',
      remarks: remarks || '',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Completed' : 'Pending',
      razorpayOrderId,
      orderStatus: 'Order Received',
    });

    const createdOrder = await order.save();

    // If COD, decrement stock immediately and emit notification
    if (paymentMethod === 'COD') {
      await decrementInventory(items);
      notifyOrderStatusChange(createdOrder);
    }

    res.status(201).json({
      order: createdOrder,
      razorpayOrderId,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_ROYALPIZZA_KEY',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm / Verify Payment for Razorpay
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let isAuthentic = true;

    if (process.env.RAZORPAY_KEY_SECRET && razorpaySignature) {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(order.razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      isAuthentic = generated_signature === razorpaySignature;
    }

    if (isAuthentic) {
      order.paymentStatus = 'Completed';
      order.razorpayPaymentId = razorpayPaymentId || `pay_test_${Date.now()}`;
      await order.save();

      // Decrement inventory stock
      await decrementInventory(order.items);

      // Emit socket notification
      notifyOrderStatusChange(order);

      res.json({ message: 'Payment verified and order confirmed!', order });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
};
