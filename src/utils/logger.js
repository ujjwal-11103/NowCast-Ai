import winston from 'winston';
import config from '../config/config.js';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize({ all: config.NODE_ENV !== 'production' }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5 
    }),
  ],
  exitOnError: false
});

if (config.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ 
    filename: 'logs/audit.log',
    level: 'info',
    format: winston.format.json()
  }));
}

export default logger;