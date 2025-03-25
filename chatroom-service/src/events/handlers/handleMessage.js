import { storeMessage } from '../../data/stores/messageStore.js';
import { kafkaProducer } from '../../data/kafkaClient.js';

export const handleMessage = async (event, _, io) => {
  const { userId, chatRoomId, message, timestamp } = event;

  if (!userId || !chatRoomId || !message) {
    throw new Error('Missing required fields for message event');
  }

  const messageObj = { userId, message, timestamp };

  // 1. Store in Redis
  await storeMessage(chatRoomId, messageObj);

  console.log(`📡 Broadcasting message from ${userId} in ${chatRoomId}`);

  // 2. Broadcast to everyone in room (including sender)
  // io.to(chatRoomId).emit('chat:message', {
  //   ...messageObj,
  //   chatRoomId,
  // });

  // send to Kafka topic
  await kafkaProducer.send({
    topic: 'chat-messages',
    messages: [
      {
        value: JSON.stringify({ userId, chatRoomId, message, timestamp }),
      },
    ],
  });

  console.log(`💬 ${userId} -> ${chatRoomId}: ${message}`);
};
