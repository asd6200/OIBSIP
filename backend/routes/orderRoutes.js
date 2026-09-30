const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
