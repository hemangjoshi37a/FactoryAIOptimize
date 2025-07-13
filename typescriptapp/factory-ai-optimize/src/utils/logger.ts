import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'factory-ai-optimize.log',
      format: combine(timestamp(), logFormat)
    })
  ]
});

// Create and export the logging methods
export const logInfo = (message: string) => logger.info(message);
export const logError = (message: string) => logger.error(message);
export const logWarn = (message: string) => logger.warn(message);
export const logDebug = (message: string) => logger.debug(message);
