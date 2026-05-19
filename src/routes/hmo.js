import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Create HMO Plan
router.post('/plans', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { hmoName, planCode, maxCoverage } = req.body;

    const result = await query(
      `INSERT INTO hmo_plans (hmo_name, plan_code, max_coverage, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [hmoName, planCode, maxCoverage]
    );

    logger.info('HMO plan created', { planCode, hmoName });

    res.status(201).json({
      success: true,
      message: 'HMO plan created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('HMO plan creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'HMO plan creation failed',
    });
  }
});

// Enroll Patient in HMO
router.post('/enrollees', authenticate, async (req, res) => {
  try {
    const { patientId, hmoId, memberId, enrollmentDate, expiryDate } = req.body;

    const result = await query(
      `INSERT INTO hmo_enrollees (patient_id, hmo_id, member_id, enrollment_date, expiry_date, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING *`,
      [patientId, hmoId, memberId, enrollmentDate, expiryDate]
    );

    logger.info('Patient enrolled in HMO', { patientId, hmoId, memberId });

    res.status(201).json({
      success: true,
      message: 'Patient enrolled in HMO successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('HMO enrollment error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'HMO enrollment failed',
    });
  }
});

// Submit Insurance Claim
router.post('/claims', authenticate, async (req, res) => {
  try {
    const { patientId, hmoId, billingId, claimAmount } = req.body;

    const result = await query(
      `INSERT INTO claims (patient_id, hmo_id, billing_id, claim_amount, status, claim_date, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
       RETURNING *`,
      [patientId, hmoId, billingId, claimAmount]
    );

    logger.info('Insurance claim submitted', { patientId, claimAmount });

    res.status(201).json({
      success: true,
      message: 'Insurance claim submitted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Claim submission error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Claim submission failed',
    });
  }
});

// Get Patient Claims
router.get('/claims/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, h.hmo_name, b.description, b.amount 
       FROM claims c 
       JOIN hmo_plans h ON c.hmo_id = h.id 
       JOIN billing b ON c.billing_id = b.id 
       WHERE c.patient_id = $1 
       ORDER BY c.claim_date DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get claims error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve claims',
    });
  }
});

// Update Claim Status
router.put('/claims/:claimId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const result = await query(
      `UPDATE claims SET status = $1, approved_date = CASE WHEN $1 = 'approved' THEN NOW() ELSE approved_date END WHERE id = $2 RETURNING *`,
      [status, req.params.claimId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    logger.info('Claim status updated', { claimId: req.params.claimId, status });

    res.status(200).json({
      success: true,
      message: 'Claim status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Claim update error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Claim update failed',
    });
  }
});

// Get HMO Plans
router.get('/plans', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM hmo_plans ORDER BY hmo_name ASC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get HMO plans error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve HMO plans',
    });
  }
});

export default router;