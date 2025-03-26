import { storeMessage } from '../../data/stores/messageStore.js';
import { kafkaProducer } from '../../data/kafkaClient.js';
import { logger } from '../../utils/logger.js';

/**
 * Handles chat message sent by a user.
 * @param {Object} event - Event payload
 * @param {Object} socket - Socket.IO socket instance
 */
export const handleMessage = async (event, socket) => {
  const { userId, chatRoomId, message, timestamp } = event;

  if (!userId || !chatRoomId || !message) {
    socket.emit('error', { message: 'Invalid message payload' });
    return;
  }

  try {
    await storeMessage(chatRoomId, { userId, message, timestamp });

    await kafkaProducer.send({
      topic: 'chat-messages',
      messages: [{ value: JSON.stringify({ userId, chatRoomId, message, timestamp }) }],
    });

    logger.info(`📤 Message from ${userId} queued to Kafka for room ${chatRoomId}`);
  } catch (err) {
    logger.error(err, '❌ Error in handleMessage');
    socket.emit('error', { message: 'Failed to send message' });
  }
};
