import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(`Error: ${err.message}`);
  logError(err.stack || 'No stack trace');

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}
