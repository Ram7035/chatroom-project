// src/data/dbClient.js
// This module provides a shared database client.
// Currently backed by Redis (used as an in-memory database).
import { createClient } from 'redis';

const db = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

db.on('error', (err) => {
  console.error('❌ DB Client Error (Redis)', err);
});

export { db };
