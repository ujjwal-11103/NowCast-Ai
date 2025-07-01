import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from './src/utils/logger.js';
import errorHandler from './src/middleware/errorHandler.js';
import securityMiddleware from './src/middleware/security.js';

const app = express();

// Security middleware
securityMiddleware(app);

// Body parser
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Enable CORS
app.use(cors());

// Routes
import authRoutes from './src/auth/routes/authRoutes.js';
app.use('/api/v1/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('👋 Server is alive!');
});

export default app;