// src/testPubSub.js
import Redis from 'ioredis';

const CHANNEL = 'chatroom:test';

const testPubSub = async () => {
  const pubClient = new Redis(); // Publisher
  const subClient = new Redis(); // Subscriber

  subClient.on('error', console.error);
  pubClient.on('error', console.error);

  // Subscribe to the channel
  await subClient.subscribe(CHANNEL);

  subClient.on('message', (channel, message) => {
    console.log(`📩 Received on ${channel}:`, JSON.parse(message));
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
    console.log('📤 Publishing:', event);
    pubClient.publish(CHANNEL, JSON.stringify(event));
  }, 500);
};

testPubSub();
