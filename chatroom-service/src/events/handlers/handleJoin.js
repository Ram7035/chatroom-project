import { addUserToRoom, getActiveUsersInRoom } from '../../data/stores/userStore.js';
import { EVENTS } from '../../constants/events.js';
import { logger } from '../../utils/logger.js';

/**
 * Handles user joining a chatroom.
 * @param {Object} event - Event payload
 * @param {Object} socket - Socket.IO socket instance
 */
export const handleJoin = async (event, socket) => {
  const { userId, chatRoomId, timestamp } = event;

  if (!userId || !chatRoomId) {
    socket.emit('error', { message: 'Missing userId or chatRoomId' });
    return;
  }

  try {
    socket.userId = userId;
    socket.chatRoomId = chatRoomId;

    await addUserToRoom(chatRoomId, userId);
    socket.join(chatRoomId);

    logger.info(`👤 User ${userId} joined room ${chatRoomId}`);

    // Broadcast to others
    socket.to(chatRoomId).emit(EVENTS.JOINED, {
      userId,
      chatRoomId,
      timestamp,
    });

    // Send active users to the new user
    const users = await getActiveUsersInRoom(chatRoomId);
    socket.emit(EVENTS.ACTIVE_USERS, { chatRoomId, users });
  } catch (err) {
    logger.error(err, '❌ Error in handleJoin');
    socket.emit('error', { message: 'Internal server error' });
  }
};
