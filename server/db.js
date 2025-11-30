const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try connecting to local MongoDB first
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean-dashboard', {
      serverSelectionTimeoutMS: 2000 // Fail fast if not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not found, starting in-memory MongoDB...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
