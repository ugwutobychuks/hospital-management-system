import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Request Lab Test
router.post('/', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, testName, testCode } = req.body;

    const result = await query(
      `INSERT INTO lab_tests (patient_id, doctor_id, test_name, test_code, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING *`,
      [patientId, doctorId, testName, testCode]
    );

    logger.info('Lab test requested', { testId: result.rows[0].id, patientId });

    res.status(201).json({
      success: true,
      message: 'Lab test requested successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Lab test request error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Lab test request failed',
    });
  }
});

// Get Patient Lab Tests
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM lab_tests WHERE patient_id = $1 ORDER BY created_at DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get lab tests error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lab tests',
    });
  }
});

export default router;