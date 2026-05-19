import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Create Bill
router.post('/', authenticate, async (req, res) => {
  try {
    const { patientId, description, amount } = req.body;
    const invoiceNumber = `INV-${Date.now()}`;

    const result = await query(
      `INSERT INTO billing (patient_id, description, amount, status, invoice_number, created_at)
       VALUES ($1, $2, $3, 'pending', $4, NOW())
       RETURNING *`,
      [patientId, description, amount, invoiceNumber]
    );

    logger.info('Bill created', { billId: result.rows[0].id, patientId, amount });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Bill creation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Bill creation failed',
    });
  }
});

// Get Patient Bills
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM billing WHERE patient_id = $1 ORDER BY created_at DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get bills error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bills',
    });
  }
});

// Process Payment
router.put('/:id/payment', authenticate, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const result = await query(
      `UPDATE billing SET status = 'paid', payment_method = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [paymentMethod, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    logger.info('Payment processed', { billId: req.params.id, paymentMethod });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Payment processing error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
    });
  }
});

export default router;