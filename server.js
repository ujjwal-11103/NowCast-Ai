import app from './app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import config from './src/config/config.js';

const PORT = config.PORT;

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});