const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const { sendStockAlertEmail } = require('../config/mailer');

const checkLowStockAndNotify = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$stock', '$minThreshold'] },
    });

    if (lowStockItems.length > 0) {
      console.log(`⚠️ Cron found ${lowStockItems.length} low stock items!`);
      const adminUsers = await User.find({ role: 'admin' });
      const adminEmail = adminUsers.length > 0 ? adminUsers[0].email : 'admin@royalpizza.com';

      await sendStockAlertEmail(adminEmail, lowStockItems);
    }
  } catch (error) {
    console.error('Error running stock check cron job:', error.message);
  }
};

const initStockCron = () => {
  // Run every 5 minutes (or schedule as needed)
  cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Running scheduled low stock check cron job...');
    await checkLowStockAndNotify();
  });

  console.log('✅ Low stock cron job initialized (running every 5 mins).');
};

module.exports = { initStockCron, checkLowStockAndNotify };
