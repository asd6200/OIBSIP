const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const { initStockCron } = require('./services/stockCron');
const { autoSeedIfEmpty } = require('./services/autoSeed');

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow all frontend origins
app.use(express.json());

// Initialize Database Connection and Auto Seed
connectDB().then(() => {
  autoSeedIfEmpty();
});

// Initialize Stock Alert Cron Job
initStockCron();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pizzas', require('./routes/pizzaRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '👑 Royal Pizza API Service is running strong!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is in use. Retrying server startup...`);
  } else {
    console.error('Server error:', e);
  }
});

// Initialize Socket.io on the HTTP server created by Express.
initSocket(server);
