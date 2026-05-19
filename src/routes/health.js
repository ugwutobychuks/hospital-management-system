import express from 'express';
import { query } from '../config/database.js';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dbResult = await query('SELECT NOW()');
    const redis = getRedisClient();
    await redis.ping();

    res.status(200).json({
      success: true,
      message: 'System is healthy',
      timestamp: new Date(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'running',
      },
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      message: 'System health check failed',
      error: error.message,
    });
  }
});

export default router;