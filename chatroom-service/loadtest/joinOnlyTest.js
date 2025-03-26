import { io } from 'socket.io-client';
import { logger } from '../src/utils/logger';

const USERS = 32000;
const ROOMS = 10000;
const SERVER_URL = 'http://localhost:8080';

let joinCount = 0;

logger.info(`🚀 Simulating ${USERS} users joining ${ROOMS} rooms (no messages)`);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

for (let i = 0; i < USERS; i++) {
  const userId = `user-${i}`;
  const roomId = `room-${i % ROOMS}`;

  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    upgrade: false,
    reconnection: false,
  });

  socket.on('connect', () => {
    socket.emit('chat:event', {
      eventType: 'join',
      userId,
      chatRoomId: roomId,
      timestamp: new Date().toISOString(),
    });

    joinCount++;
    if (joinCount % 1000 === 0) {
      logger.info(`✅ ${joinCount} users joined`);
    }

    // Optional: Track room joins
    if (joinCount === USERS) {
      logger.info(`🎉 All ${USERS} users joined ${ROOMS} rooms`);
    }
  });

  socket.on('connect_error', (err) => {
    logger.error(err, `❌ User ${userId} failed to connect`);
  });

  // Throttle connection rate
  await delay(2);
}
