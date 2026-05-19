import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import expressAsyncErrors from 'express-async-errors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Import configurations and utilities
import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { initializeDatabase } from './config/database.js';
import { initializeRedis } from './config/redis.js';

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescriptions.js';
import labRoutes from './routes/laboratory.js';
import pharmacyRoutes from './routes/pharmacy.js';
import billingRoutes from './routes/billing.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/reports.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true,
  },
});

// ========================
// Middleware Setup
// ========================

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Compression Middleware
app.use(compression());

// Logging Middleware
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));
app.use(requestLogger);

// Express Async Errors
expressAsyncErrors();

// ========================
// Static Files
// ========================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// ========================
// API Routes
// ========================
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/laboratory', labRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reports', reportRoutes);

// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ========================
// Error Handler Middleware
// ========================
app.use(errorHandler);

// ========================
// WebSocket Setup
// ========================
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join-queue', (data) => {
    socket.join(`queue-${data.queueId}`);
    io.to(`queue-${data.queueId}`).emit('user-joined', { userId: socket.id });
  });

  socket.on('queue-update', (data) => {
    io.to(`queue-${data.queueId}`).emit('queue-updated', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// ========================
// Initialize Services
// ========================
const initializeServices = async () => {
  try {
    logger.info('Initializing Hospital Management System...');

    // Initialize Database
    logger.info('Connecting to PostgreSQL...');
    await initializeDatabase();
    logger.info('✓ Database connected successfully');

    // Initialize Redis
    logger.info('Connecting to Redis...');
    await initializeRedis();
    logger.info('✓ Redis connected successfully');

    logger.info('✓ All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// ========================
// Graceful Shutdown
// ========================
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 3000;

initializeServices().then(() => {
  server.listen(PORT, () => {
    logger.info(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║    Hospital Management System - ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}           ║
    ║    Server Running on Port: ${PORT}                            ║
    ║                                                           ║
    ║    API Documentation: http://localhost:${PORT}/api/docs   ║
    ║    Health Check: http://localhost:${PORT}/api/v1/health   ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
  });
});

export { app, server, io };