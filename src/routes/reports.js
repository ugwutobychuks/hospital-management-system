import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Revenue Report
router.get('/revenue', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT DATE(created_at) as date, SUM(amount) as total FROM billing WHERE status = 'paid' GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Revenue report error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to generate revenue report',
    });
  }
});

// Patient Statistics
router.get('/patients', authenticate, async (req, res) => {
  try {
    const totalPatients = await query('SELECT COUNT(*) FROM patients');
    const newPatients = await query('SELECT COUNT(*) FROM patients WHERE created_at >= NOW() - INTERVAL \'30 days\'');
    const malePatients = await query('SELECT COUNT(*) FROM patients WHERE gender = \'M\'');
    const femalePatients = await query('SELECT COUNT(*) FROM patients WHERE gender = \'F\'');

    res.status(200).json({
      success: true,
      data: {
        total: parseInt(totalPatients.rows[0].count),
        newPatients: parseInt(newPatients.rows[0].count),
        malePatients: parseInt(malePatients.rows[0].count),
        femalePatients: parseInt(femalePatients.rows[0].count),
      },
    });
  } catch (error) {
    logger.error('Patient statistics error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to generate patient statistics',
    });
  }
});

// Appointment Statistics
router.get('/appointments', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT status, COUNT(*) as count FROM appointments GROUP BY status`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Appointment statistics error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to generate appointment statistics',
    });
  }
});

export default router;