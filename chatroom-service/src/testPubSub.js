// src/testPubSub.js
import Redis from 'ioredis';
import { logger } from './utils/logger';

const CHANNEL = 'chatroom:test';

const testPubSub = async () => {
  const pubClient = new Redis(); // Publisher
  const subClient = new Redis(); // Subscriber

  subClient.on('error', logger.error);
  pubClient.on('error', logger.error);

  // Subscribe to the channel
  await subClient.subscribe(CHANNEL);

  subClient.on('message', (channel, message) => {
    logger.info(`📩 Received on ${channel}:`, JSON.parse(message));
    process.exit(0); // Exit after receiving message
  });

  // Give time for subscriber to be ready
  setTimeout(() => {
    const event = {
      eventType: 'message',
      userId: 'test-user',
      chatRoomId: 'test',
      message: 'Hello from pub!',
      timestamp: new Date().toISOString(),
    };
    logger.info('📤 Publishing:', event);
    pubClient.publish(CHANNEL, JSON.stringify(event));
  }, 500);
};

testPubSub();
