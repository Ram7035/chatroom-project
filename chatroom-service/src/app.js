// src/app.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketRedisAdapter } from './socket/socketSetup.js';
import { processEvent } from './events/processEvent.js';
import { db } from './data/dbClient.js'
import { removeUserFromRoom } from './data/stores/userStore.js'
import router from './routes/index.js';
import { connectKafka, startKafkaConsumer } from './data/kafkaClient.js';

dotenv.config();

export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use(router);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  if (!db.isOpen) {
    await db.connect();
    console.log('✅ Connected to Redis DB');
  }

  await setupSocketRedisAdapter(io);

  app.get('/', (req, res) => {
    res.send('Chatroom microservice is running!');
  });

  io.on('connection', (socket) => {
    console.log(`⚡ [Instance on PORT ${process.env.PORT}] New socket connected: ${socket.id}`);

    socket.on('chat:event', async (event) => {
      await processEvent(event, socket, io);
    });

    socket.on('disconnect', async (reason) => {
      const { userId, chatRoomId } = socket;

      if (userId && chatRoomId) {
        console.log(`❌ ${userId} disconnected from ${chatRoomId}`);
        await removeUserFromRoom(chatRoomId, userId);
      }
    });
  });

  await connectKafka();
  await startKafkaConsumer(io);

  return { app, server, io };
}
