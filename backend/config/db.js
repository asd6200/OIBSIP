const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('⚡ Starting MongoMemoryServer for instant zero-config setup...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.join(__dirname, '..', 'data_db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
        },
      });
      mongoUri = mongod.getUri();
      console.log(`✅ MongoMemoryServer running at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    try {
      console.log('🔄 Attempting standard in-memory MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const fallbackUri = mongod.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`✅ Standard MongoMemoryServer Connected: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`❌ Fallback failed: ${fallbackError.message}`);
    }
  }
};

module.exports = connectDB;
