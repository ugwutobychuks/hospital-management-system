import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Create Doctor Profile
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { userId, specialization, licenseNumber, phone } = req.body;

    const result = await query(
      `INSERT INTO doctors (user_id, specialization, license_number, phone, registration_date, created_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userId, specialization, licenseNumber, phone]
    );

    logger.info('Doctor profile created', { doctorId: result.rows[0].id, userId });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Doctor creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Doctor profile creation failed',
    });
  }
});

// Get All Doctors
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query('SELECT COUNT(*) FROM doctors');
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT d.*, u.first_name, u.last_name, u.email 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       ORDER BY u.first_name ASC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get doctors error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors',
    });
  }
});

// Get Single Doctor
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT d.*, u.first_name, u.last_name, u.email 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Get doctor error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctor',
    });
  }
});

export default router;