import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';
import { sendPushNotification } from '../services/notificationService.js';

const router = express.Router();

// Register Device Token
router.post('/device-token', authenticate, async (req, res) => {
  try {
    const { token, deviceType } = req.body;

    // Check if token already exists
    const existing = await query(
      `SELECT id FROM device_tokens WHERE token = $1`,
      [token]
    );

    let result;
    if (existing.rows.length > 0) {
      result = existing.rows[0];
    } else {
      const insertResult = await query(
        `INSERT INTO device_tokens (user_id, token, device_type, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING *`,
        [req.user.id, token, deviceType]
      );
      result = insertResult.rows[0];
    }

    logger.info('Device token registered', { userId: req.user.id, deviceType });

    res.status(201).json({
      success: true,
      message: 'Device token registered',
      data: result,
    });
  } catch (error) {
    logger.error('Device token registration error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Device token registration failed',
    });
  }
});

// Get User Notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1`,
      [req.user.id]
    );

    const result = await query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
      },
    });
  } catch (error) {
    logger.error('Get notifications error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
    });
  }
});

// Mark Notification as Read
router.put('/:notificationId/read', authenticate, async (req, res) => {
  try {
    const result = await query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.notificationId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    logger.info('Notification marked as read', { notificationId: req.params.notificationId });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Mark notification read error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  }
});

// Send Test Notification
router.post('/test', authenticate, async (req, res) => {
  try {
    const { title, message } = req.body;

    // Get user's device tokens
    const tokensResult = await query(
      `SELECT token FROM device_tokens WHERE user_id = $1`,
      [req.user.id]
    );

    const promises = tokensResult.rows.map((row) =>
      sendPushNotification(row.token, title, message)
    );

    await Promise.all(promises);

    logger.info('Test notification sent', { userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Test notification sent',
    });
  } catch (error) {
    logger.error('Send test notification error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
    });
  }
});

export default router;