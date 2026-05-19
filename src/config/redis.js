import redis from 'redis';
import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

let redisClient;

export const initializeRedis = async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB) || 0,
    });

    redisClient.on('error', (error) => {
      logger.error('Redis error', { error: error.message });
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection failed', { error: error.message });
    throw error;
  }
};

export const getRedisClient = () => redisClient;

export const cacheSet = async (key, value, expirationSeconds = 3600) => {
  try {
    await redisClient.setEx(key, expirationSeconds, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set error', { key, error: error.message });
  }
};

export const cacheGet = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Cache get error', { key, error: error.message });
    return null;
  }
};

export const cacheDelete = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Cache delete error', { key, error: error.message });
  }
};

export const cacheClear = async () => {
  try {
    await redisClient.flushDb();
  } catch (error) {
    logger.error('Cache clear error', { error: error.message });
  }
};

export default redisClient;