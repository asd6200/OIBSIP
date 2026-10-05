let io = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join room based on userId or orderId
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`👤 Socket ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const notifyOrderStatusChange = (order) => {
  if (io) {
    // Emit to specific order room and user room
    io.to(`order_${order._id}`).emit('orderStatusUpdated', order);
    io.to(`user_${order.user}`).emit('orderStatusUpdated', order);
    // Also emit broadcast for admin dashboard updates
    io.emit('adminOrderUpdated', order);
    console.log(`⚡ Broadcasted status change for Order #${order._id} -> ${order.orderStatus}`);
  }
};

module.exports = { initSocket, getIO, notifyOrderStatusChange };
