import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    logger.info('MongoDB Connected...');
    
    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
    });
    
    // Close connection on process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (err) {
    logger.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;