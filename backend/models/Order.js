const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
        },
        name: String,
        price: Number,
        quantity: Number,
        crust: String,
        size: String,
        isCustom: Boolean,
        customDetails: {
          base: String,
          sauce: String,
          cheese: String,
          veggies: [String],
        },
      },
    ],
    quickAddons: [
      {
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    walletPointsRedeemed: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      enum: ['Delivery', 'Take-Away'],
      default: 'Delivery',
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'Online',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    orderStatus: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Received',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
