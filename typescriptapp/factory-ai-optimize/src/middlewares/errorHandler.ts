import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack || 'No stack trace');

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}