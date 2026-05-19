import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import QRCode from 'qrcode';

const router = express.Router();

// Create Patient
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodType,
      genotype,
      allergies,
      nextOfKin,
      nextOfKinPhone,
    } = req.body;

    // Generate unique hospital ID
    const hospitalId = `HMS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const result = await query(
      `INSERT INTO patients 
       (hospital_id, first_name, last_name, date_of_birth, gender, phone, email, address, 
        blood_type, genotype, allergies, next_of_kin, next_of_kin_phone, created_by, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()) 
       RETURNING *`,
      [
        hospitalId, firstName, lastName, dateOfBirth, gender, phone, email, address,
        bloodType, genotype, allergies, nextOfKin, nextOfKinPhone, req.user.id,
      ]
    );

    const patient = result.rows[0];

    // Generate QR code
    const qrCode = await QRCode.toDataURL(`HMS:${patient.id}:${patient.hospital_id}`);

    logger.info('Patient created successfully', { patientId: patient.id, hospitalId });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        ...patient,
        qrCode,
      },
    });
  } catch (error) {
    logger.error('Patient creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Patient registration failed',
    });
  }
});

// Get All Patients (with pagination)
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query('SELECT COUNT(*) FROM patients');
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      'SELECT * FROM patients ORDER BY created_at DESC LIMIT $1 OFFSET $2',
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
    logger.error('Get patients error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patients',
    });
  }
});

// Get Single Patient
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query('SELECT * FROM patients WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Get patient error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient',
    });
  }
});

// Update Patient
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address, allergies } = req.body;

    const result = await query(
      `UPDATE patients 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           email = COALESCE($4, email),
           address = COALESCE($5, address),
           allergies = COALESCE($6, allergies),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [firstName, lastName, phone, email, address, allergies, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    logger.info('Patient updated successfully', { patientId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Patient update error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Patient update failed',
    });
  }
});

// Delete Patient
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM patients WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    logger.info('Patient deleted successfully', { patientId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    logger.error('Patient deletion error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Patient deletion failed',
    });
  }
});

// Search Patients
router.get('/search/:searchQuery', authenticate, async (req, res) => {
  try {
    const searchQuery = `%${req.params.searchQuery}%`;

    const result = await query(
      `SELECT * FROM patients 
       WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR hospital_id ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
       LIMIT 20`,
      [searchQuery]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Patient search error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Patient search failed',
    });
  }
});

export default router;