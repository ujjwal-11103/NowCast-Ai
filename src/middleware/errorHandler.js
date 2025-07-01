import logger from '../utils/logger.js';
import config from '../config/config.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log full error in development, limited info in production
  if (config.NODE_ENV === 'development') {
    logger.error(`[${req.method}] ${req.path} - ${statusCode} - ${message} - ${err.stack}`);
  } else {
    logger.error(`[${req.method}] ${req.path} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;