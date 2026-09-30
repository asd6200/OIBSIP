const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['base', 'sauce', 'cheese', 'veggie', 'addon'],
    },
    stock: {
      type: Number,
      required: true,
      default: 100,
    },
    minThreshold: {
      type: Number,
      default: 20,
    },
    unitPrice: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
