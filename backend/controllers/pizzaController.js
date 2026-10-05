const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

// Get all menu pizzas
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get custom pizza builder options from inventory
const getCustomOptions = async (req, res) => {
  try {
    const bases = await Inventory.find({ category: 'base' });
    const sauces = await Inventory.find({ category: 'sauce' });
    const cheeses = await Inventory.find({ category: 'cheese' });
    const veggies = await Inventory.find({ category: 'veggie' });

    res.json({
      bases,
      sauces,
      cheeses,
      veggies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPizzas,
  getCustomOptions,
};
