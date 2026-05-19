import { logger } from '../config/logger.js';

export const errorHandler = (error, req, res, next) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export default errorHandler;