import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Create Prescription
router.post('/', authenticate, async (req, res) => {
  try {
    const { consultationId, doctorId, patientId, drugName, dosage, frequency, duration, quantity, instructions } = req.body;

    const result = await query(
      `INSERT INTO prescriptions 
       (consultation_id, doctor_id, patient_id, drug_name, dosage, frequency, duration, quantity, instructions, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [consultationId, doctorId, patientId, drugName, dosage, frequency, duration, quantity, instructions]
    );

    logger.info('Prescription created', { prescriptionId: result.rows[0].id, patientId });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Prescription creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Prescription creation failed',
    });
  }
});

// Get Patient Prescriptions
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.first_name, u.last_name 
       FROM prescriptions p 
       JOIN doctors d ON p.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE p.patient_id = $1 
       ORDER BY p.created_at DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get prescriptions error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve prescriptions',
    });
  }
});

export default router;