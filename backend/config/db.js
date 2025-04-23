const mongoose = require("mongoose");

const connectWithRetry = async (retries = 5, delay = 5002) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job_board', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        family: 4 // Use IPv4, skip trying IPv6
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Create indexes for unique fields
      const User = require('../models/User');
      await User.createIndexes();

      // Handle connection events
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
        // Try to reconnect
        setTimeout(() => connectWithRetry(1), delay);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(() => connectWithRetry(1), delay);
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      // Connection successful, exit the retry loop
      return conn;

    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        // Last retry attempt failed
        console.error('All connection attempts failed. Please check if MongoDB is running.');
        console.error('Connection string:', process.env.MONGO_URI || 'mongodb://localhost:27017/job_board');
        throw error;
      }
      
      // Wait before trying again
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const connectDB = async () => {
  try {
    await connectWithRetry();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Re-throw to be handled by the server startup
  }
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;
