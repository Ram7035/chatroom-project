import { io } from 'socket.io-client';

const USERS = 10000; // total connections
const ROOMS = 1000;  // distinct chatrooms
const MESSAGE_INTERVAL_MS = 10000; // 1 message per 10 seconds per user
const SERVER_URL = 'http://localhost:8080';

console.log(`🚀 Starting load test: ${USERS} users, ${ROOMS} rooms`);

let sockets = [];

for (let i = 0; i < USERS; i++) {
  const userId = `user-${i}`;
  const roomId = `room-${i % ROOMS}`;

  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    upgrade: false,
    reconnectionAttempts: 3,
    reconnectionDelay: 500,
  });

  socket.on('connect', () => {
    socket.emit('chat:event', {
      eventType: 'join',
      userId,
      chatRoomId: roomId,
      timestamp: new Date().toISOString(),
    });

    // Send message every N seconds
    setInterval(() => {
      socket.emit('chat:event', {
        eventType: 'message',
        userId,
        chatRoomId: roomId,
        message: `Hello from ${userId}`,
        timestamp: new Date().toISOString(),
      });
    }, MESSAGE_INTERVAL_MS);
  });

  socket.on('connect_error', (err) => {
    console.error(`❌ Failed to connect user ${userId}:`, err.message);
  });

  sockets.push(socket);

  // Throttle connection creation slightly
  await new Promise((res) => setTimeout(res, 5)); // slower ramp-up
}

console.log(`✅ All ${USERS} users connected`);
