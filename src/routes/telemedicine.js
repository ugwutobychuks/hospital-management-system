import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Create Telemedicine Consultation
router.post('/consultations', authenticate, async (req, res) => {
  try {
    const { patientId, doctorId, consultationDate, consultationType } = req.body;
    const meetingId = `MEET-${uuidv4()}`;
    const meetingToken = `TOKEN-${uuidv4()}`;

    const result = await query(
      `INSERT INTO consultations (patient_id, doctor_id, appointment_id, chief_complaint, created_at)
       VALUES ($1, $2, NULL, $3, NOW())
       RETURNING id`,
      [patientId, doctorId, `TELEMEDICINE: ${consultationType}`]
    );

    const consultation = result.rows[0];

    logger.info('Telemedicine consultation created', { consultationId: consultation.id, meetingId });

    res.status(201).json({
      success: true,
      message: 'Telemedicine consultation scheduled',
      data: {
        consultationId: consultation.id,
        meetingId,
        meetingToken,
        consultationDate,
        consultationType,
        status: 'scheduled',
      },
    });
  } catch (error) {
    logger.error('Telemedicine consultation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Telemedicine consultation creation failed',
    });
  }
});

// Start Telemedicine Session
router.post('/sessions/start', authenticate, async (req, res) => {
  try {
    const { consultationId, participantType } = req.body;
    const sessionId = `SESSION-${uuidv4()}`;

    logger.info('Telemedicine session started', { consultationId, sessionId, participantType });

    res.status(200).json({
      success: true,
      message: 'Telemedicine session started',
      data: {
        sessionId,
        consultationId,
        timestamp: new Date(),
        participantType,
        status: 'active',
      },
    });
  } catch (error) {
    logger.error('Session start error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to start session',
    });
  }
});

// End Telemedicine Session
router.post('/sessions/end', authenticate, async (req, res) => {
  try {
    const { sessionId, consultationId, notes } = req.body;

    const result = await query(
      `UPDATE consultations SET notes = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [notes, consultationId]
    );

    logger.info('Telemedicine session ended', { sessionId, consultationId });

    res.status(200).json({
      success: true,
      message: 'Telemedicine session ended',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Session end error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to end session',
    });
  }
});

// Get Patient Telemedicine History
router.get('/history/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, d.user_id, u.first_name, u.last_name 
       FROM consultations c 
       JOIN doctors d ON c.doctor_id = d.id 
       JOIN users u ON d.user_id = u.id 
       WHERE c.patient_id = $1 AND c.chief_complaint LIKE 'TELEMEDICINE%' 
       ORDER BY c.created_at DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get telemedicine history error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve telemedicine history',
    });
  }
});

export default router;