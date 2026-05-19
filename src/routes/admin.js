import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Dashboard Stats
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalPatients = await query('SELECT COUNT(*) FROM patients');
    const totalAppointments = await query('SELECT COUNT(*) FROM appointments');
    const totalBilling = await query('SELECT SUM(amount) FROM billing WHERE status = \'paid\'');
    const pendingBilling = await query('SELECT SUM(amount) FROM billing WHERE status = \'pending\'');

    res.status(200).json({
      success: true,
      data: {
        totalPatients: parseInt(totalPatients.rows[0].count),
        totalAppointments: parseInt(totalAppointments.rows[0].count),
        totalRevenue: parseFloat(totalBilling.rows[0].sum || 0),
        pendingRevenue: parseFloat(pendingBilling.rows[0].sum || 0),
      },
    });
  } catch (error) {
    logger.error('Dashboard stats error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
    });
  }
});

// User Management
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get users error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
    });
  }
});

// Audit Logs
router.get('/audit-logs', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get audit logs error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs',
    });
  }
});

export default router;