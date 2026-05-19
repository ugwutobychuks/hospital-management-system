import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Allocate Bed
router.post('/beds/allocate', authenticate, authorize('nurse', 'admin'), async (req, res) => {
  try {
    const { bedNumber, patientId, wardName } = req.body;

    const result = await query(
      `INSERT INTO ward_beds (bed_number, ward_name, patient_id, status, admission_date, created_at)
       VALUES ($1, $2, $3, 'occupied', NOW(), NOW())
       RETURNING *`,
      [bedNumber, wardName, patientId]
    );

    logger.info('Bed allocated', { bedNumber, patientId, wardName });

    res.status(201).json({
      success: true,
      message: 'Bed allocated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Bed allocation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Bed allocation failed',
    });
  }
});

// Get Available Beds
router.get('/beds/available', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM ward_beds WHERE status = 'available' ORDER BY ward_name ASC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get available beds error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve available beds',
    });
  }
});

// Record Vital Signs
router.post('/vital-signs', authenticate, authorize('nurse', 'admin'), async (req, res) => {
  try {
    const { patientId, temperature, bloodPressure, pulse, respiratoryRate, oxygenSaturation } = req.body;

    const vitalSigns = {
      temperature,
      bloodPressure,
      pulse,
      respiratoryRate,
      oxygenSaturation,
      recordedAt: new Date(),
    };

    const result = await query(
      `INSERT INTO consultations (patient_id, vital_signs, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [patientId, JSON.stringify(vitalSigns)]
    );

    logger.info('Vital signs recorded', { patientId });

    res.status(201).json({
      success: true,
      message: 'Vital signs recorded successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Vital signs recording error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to record vital signs',
    });
  }
});

// Get Patient Vital Signs
router.get('/vital-signs/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT vital_signs, created_at FROM consultations WHERE patient_id = $1 AND vital_signs IS NOT NULL ORDER BY created_at DESC LIMIT 20`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get vital signs error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vital signs',
    });
  }
});

// Discharge Patient
router.put('/discharge/:bedId', authenticate, authorize('nurse', 'admin'), async (req, res) => {
  try {
    const result = await query(
      `UPDATE ward_beds SET status = 'available', patient_id = NULL, discharge_date = NOW() WHERE id = $1 RETURNING *`,
      [req.params.bedId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found',
      });
    }

    logger.info('Patient discharged', { bedId: req.params.bedId });

    res.status(200).json({
      success: true,
      message: 'Patient discharged successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Discharge error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Discharge failed',
    });
  }
});

// Get Ward Occupancy
router.get('/occupancy/:wardName', authenticate, async (req, res) => {
  try {
    const occupied = await query(
      `SELECT COUNT(*) FROM ward_beds WHERE ward_name = $1 AND status = 'occupied'`,
      [req.params.wardName]
    );

    const total = await query(
      `SELECT COUNT(*) FROM ward_beds WHERE ward_name = $1`,
      [req.params.wardName]
    );

    res.status(200).json({
      success: true,
      data: {
        wardName: req.params.wardName,
        occupied: parseInt(occupied.rows[0].count),
        total: parseInt(total.rows[0].count),
        available: parseInt(total.rows[0].count) - parseInt(occupied.rows[0].count),
      },
    });
  } catch (error) {
    logger.error('Get occupancy error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve occupancy',
    });
  }
});

export default router;