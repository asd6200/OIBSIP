const express = require('express');
const router = express.Router();
const {
  getInventory,
  updateStock,
  addInventoryItem,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use(protect, admin);

router.get('/inventory', getInventory);
router.put('/inventory/:id', updateStock);
router.post('/inventory', addInventoryItem);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
