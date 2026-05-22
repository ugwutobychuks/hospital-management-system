import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://98.84.56.161:5173', 'http://172.31.0.209:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (for dashboard)
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy', service: 'hospital-management-system' });
});

// Import routes
import authRouter from './routes/auth.js';
import doctorsRouter from './routes/doctors.js';
import patientsRouter from './routes/patients.js';
import appointmentsRouter from './routes/appointments.js';
import medicationsRouter from './routes/medications.js';

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/medications', medicationsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      doctors: '/api/v1/doctors',
      patients: '/api/v1/patients',
      appointments: '/api/v1/appointments',
      medications: '/api/v1/medications'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`📍 Doctors endpoint: http://localhost:${PORT}/api/v1/doctors`);
});

export default app;
