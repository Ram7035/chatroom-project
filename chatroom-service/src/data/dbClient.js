// This module provides a shared database client.
// Currently backed by Redis (used as an in-memory database).
import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

const db = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

db.on('error', (err) => {
  logger.error(err, '❌ DB Client Error (Redis)');
});

export { db };
