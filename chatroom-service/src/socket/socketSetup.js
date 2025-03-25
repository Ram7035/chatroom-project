import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

let pubClient, subClient;

export async function setupSocketRedisAdapter(io) {
  pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  subClient = pubClient.duplicate();

  pubClient.on('error', console.error);
  subClient.on('error', console.error);

  io.adapter(createAdapter(pubClient, subClient));

  console.log('✅ Socket.IO Redis adapter connected');
}

export async function shutdownSocketRedisAdapter() {
    if (pubClient) await pubClient.quit();
    if (subClient) await subClient.quit();
    console.log('🔌 Redis pub/sub adapter connections closed');
}
  