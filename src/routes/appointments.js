import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Create Appointment
router.post('/', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, notes } = req.body;

    const result = await query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes, created_at)
       VALUES ($1, $2, $3, 'scheduled', $4, NOW())
       RETURNING *`,
      [patientId, doctorId, appointmentDate, notes]
    );

    logger.info('Appointment created', { appointmentId: result.rows[0].id, patientId, doctorId });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Appointment creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Appointment scheduling failed',
    });
  }
});

// Get Appointments for Patient
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, d.specialization, u.first_name, u.last_name 
       FROM appointments a 
       JOIN doctors d ON a.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE a.patient_id = $1 
       ORDER BY a.appointment_date DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get patient appointments error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
    });
  }
});

// Get Appointments for Doctor
router.get('/doctor/:doctorId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, p.first_name, p.last_name, p.hospital_id 
       FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       WHERE a.doctor_id = $1 
       ORDER BY a.appointment_date ASC`,
      [req.params.doctorId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get doctor appointments error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
    });
  }
});

// Update Appointment Status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await query(
      `UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    logger.info('Appointment updated', { appointmentId: req.params.id, status });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Appointment update error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Appointment update failed',
    });
  }
});

export default router;