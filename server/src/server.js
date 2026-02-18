import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import { initializeSocket } from './config/socket.js';
import { startContestStateManager } from './jobs/contestStateManager.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CodeArena API Server',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start background jobs
startContestStateManager();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
