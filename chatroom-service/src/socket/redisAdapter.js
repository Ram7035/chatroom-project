import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

let pubClient, subClient;

export async function setupSocketRedisAdapter(io) {
  pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  subClient = pubClient.duplicate();

  pubClient.on('error', logger.error);
  subClient.on('error', logger.error);

  io.adapter(createAdapter(pubClient, subClient));

  logger.info('✅ Socket.IO Redis adapter connected');
}

export async function shutdownSocketRedisAdapter() {
    if (pubClient) await pubClient.quit();
    if (subClient) await subClient.quit();
    logger.info('🔌 Redis pub/sub adapter connections closed');
}
  