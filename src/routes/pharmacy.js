import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Add Drug to Inventory
router.post('/inventory', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { drugName, drugCode, quantity, unitPrice, batchNumber, expiryDate, reorderLevel } = req.body;

    const result = await query(
      `INSERT INTO pharmacy_inventory (drug_name, drug_code, quantity, unit_price, batch_number, expiry_date, reorder_level, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [drugName, drugCode, quantity, unitPrice, batchNumber, expiryDate, reorderLevel]
    );

    logger.info('Drug added to inventory', { drugCode, quantity });

    res.status(201).json({
      success: true,
      message: 'Drug added to inventory',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Add drug error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to add drug to inventory',
    });
  }
});

// Get Inventory
router.get('/inventory', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM pharmacy_inventory WHERE quantity > 0 ORDER BY drug_name ASC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get inventory error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory',
    });
  }
});

// Dispense Drug
router.post('/dispense', authenticate, authorize('pharmacist', 'admin'), async (req, res) => {
  try {
    const { prescriptionId, pharmacistId, quantityDispensed } = req.body;

    // Get prescription details
    const presResult = await query('SELECT drug_name FROM prescriptions WHERE id = $1', [prescriptionId]);
    if (presResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Get drug details
    const drugResult = await query('SELECT unit_price FROM pharmacy_inventory WHERE drug_name = $1', [presResult.rows[0].drug_name]);
    if (drugResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Drug not found in inventory' });
    }

    const unitPrice = drugResult.rows[0].unit_price;
    const totalPrice = unitPrice * quantityDispensed;

    const result = await query(
      `INSERT INTO dispensing (prescription_id, pharmacist_id, quantity_dispensed, unit_price, total_price, dispensed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [prescriptionId, pharmacistId, quantityDispensed, unitPrice, totalPrice]
    );

    logger.info('Drug dispensed', { prescriptionId, quantityDispensed });

    res.status(201).json({
      success: true,
      message: 'Drug dispensed successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Dispense error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Drug dispensing failed',
    });
  }
});

export default router;