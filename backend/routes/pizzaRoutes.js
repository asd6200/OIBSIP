const express = require('express');
const router = express.Router();
const { getPizzas, getCustomOptions } = require('../controllers/pizzaController');

router.get('/', getPizzas);
router.get('/custom-options', getCustomOptions);

module.exports = router;
