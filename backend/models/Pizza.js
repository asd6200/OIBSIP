const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g., 'Veg', 'Non-Veg', 'Gourmet', 'Nutri Crust', 'Cheesy', 'Street'
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    crust: {
      type: String,
      default: 'Hand Tossed',
    },
    size: {
      type: String,
      default: 'Regular',
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    baseIngredient: {
      type: String, // e.g. 'Hand Tossed'
      default: 'Hand Tossed',
    },
    sauceIngredient: {
      type: String, // e.g. 'Classic Tomato'
      default: 'Classic Tomato',
    },
    cheeseIngredient: {
      type: String, // e.g. 'Mozzarella'
      default: 'Mozzarella',
    },
    veggieIngredients: [{
      type: String, // e.g. ['Capsicum', 'Corn', 'Onion']
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', pizzaSchema);
