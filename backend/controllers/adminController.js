const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const { notifyOrderStatusChange } = require('../services/socketService');
const { checkLowStockAndNotify } = require('../services/stockCron');

// Get full inventory list
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({}).sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stock quantity for an inventory item
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, minThreshold } = req.body;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (stock !== undefined) item.stock = Math.max(0, parseInt(stock, 10));
    if (minThreshold !== undefined) item.minThreshold = Math.max(1, parseInt(minThreshold, 10));

    await item.save();

    // Check if stock is low to notify admin
    await checkLowStockAndNotify();

    res.json({ message: 'Stock updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new inventory item
const addInventoryItem = async (req, res) => {
  try {
    const { name, category, stock, minThreshold, unitPrice } = req.body;

    const exists = await Inventory.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Inventory item with this name already exists' });
    }

    const item = await Inventory.create({
      name,
      category,
      stock: stock || 100,
      minThreshold: minThreshold || 20,
      unitPrice: unitPrice || 30,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email address')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Order Received -> In Kitchen -> Sent to Delivery -> Delivered)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Broadcast real-time status update to user via Socket.io
    notifyOrderStatusChange(order);

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventory,
  updateStock,
  addInventoryItem,
  getAllOrders,
  updateOrderStatus,
};
