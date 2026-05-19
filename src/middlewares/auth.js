import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
          error: error.message,
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

export default { authenticate, authorize };