
import { CONFIG as defaultConfig } from './config';
import * as dotenv from 'dotenv';

dotenv.config();

// Enhanced configuration loader with environment support
export function loadConfig() {
  return {
    ...defaultConfig,
    AI_MODEL: process.env.AI_MODEL || defaultConfig.AI_MODEL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    MAX_CONCURRENT_PROCESSES: parseInt(process.env.MAX_CONCURRENT_PROCESSES || '4'),
    DATA_RETENTION_DAYS: parseInt(process.env.DATA_RETENTION_DAYS || '30'),
    FACTORY_LAYOUT: process.env.FACTORY_LAYOUT || defaultConfig.FACTORY_LAYOUT
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;
