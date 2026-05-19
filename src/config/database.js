import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hospital_management_system',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (error) => {
  logger.error('Unexpected error on idle client', error);
});

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info('Database connection test successful', { timestamp: result.rows[0] });
    client.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    throw error;
  }
};

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;