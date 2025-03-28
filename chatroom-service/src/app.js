// app entry point with graceful shutdown
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { setupSocketRedisAdapter } from './socket/redisAdapter.js';
import { kafkaProducer, kafkaConsumer } from './data/kafkaClient.js';
import { db } from './data/dbClient.js';
import { removeUserFromRoom } from './data/stores/userStore.js';
import { registerSocketEvents } from './socket/index.js';
import router from './routes/index.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/', router);

app.get('/', (_, res) => {
  res.send('Chatroom microservice is running!');
});

io.on('connection', (socket) => {
  logger.info(`🔌 Socket connected: ${socket.id}`);
  registerSocketEvents(socket, io);

  socket.on('disconnect', async () => {
    const { userId, chatRoomId } = socket;
    if (userId && chatRoomId) {
      await removeUserFromRoom(chatRoomId, userId);
      socket.to(chatRoomId).emit('user:left', { userId, chatRoomId });
      console.log(`❌ ${userId} disconnected from ${chatRoomId}`);
    }
  });
});

export async function start() {
  try {
    await db.connect();
    logger.info('✅ Connected to Redis');

    await setupSocketRedisAdapter(io);
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    logger.info('✅ Kafka consumer connected');

    await kafkaConsumer.subscribe({ topic: 'chat-messages', fromBeginning: false });

    kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        io.to(data.chatRoomId).emit('chat:message', data);
      },
    });

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
}

function shutdown() {
  logger.info('🛑 Graceful shutdown...');
  server.close(() => {
    logger.info('🧼 HTTP server closed');
    Promise.all([db.quit(), kafkaProducer.disconnect(), kafkaConsumer.disconnect()]).then(() => {
      logger.info('✅ Cleanup complete. Exiting.');
      process.exit(0);
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export { app };
