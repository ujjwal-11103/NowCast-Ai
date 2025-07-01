import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import config from '../config/config.js';

const securityMiddleware = (app) => {
  // Security headers
  app.use(helmet());
  
  // Rate limiting
  app.use(rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW,
    max: config.RATE_LIMIT_MAX,
    message: 'Too many requests from this IP, please try again later'
  }));
  
  // Data sanitization
  app.use(mongoSanitize());
  
  // Disable powered-by header
  app.disable('x-powered-by');
  
  // CORS configuration for production
  if (config.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'https://your-production-domain.com');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });
  }
};

export default securityMiddleware;