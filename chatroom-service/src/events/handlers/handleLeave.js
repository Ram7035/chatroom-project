import { removeUserFromRoom, getActiveUsersInRoom } from '../../data/stores/userStore.js';
import { EVENTS } from '../../constants/events.js';
import { logger } from '../../utils/logger.js';

/**
 * Handles user leaving a chatroom.
 * @param {Object} event - Event payload
 * @param {Object} socket - Socket.IO socket instance
 */
export const handleLeave = async (event, socket) => {
  const { userId, chatRoomId, timestamp } = event;

  if (!userId || !chatRoomId) {
    socket.emit('error', { message: 'Missing userId or chatRoomId' });
    return;
  }

  try {
    await removeUserFromRoom(chatRoomId, userId);
    socket.leave(chatRoomId);

    logger.info(`👋 User ${userId} left room ${chatRoomId}`);

    socket.to(chatRoomId).emit(EVENTS.USER_LEFT, {
      userId,
      chatRoomId,
      timestamp,
    });

    // Send active users to the new user
    const users = await getActiveUsersInRoom(chatRoomId);
    socket.emit(EVENTS.ACTIVE_USERS, { chatRoomId, users });
  } catch (err) {
    logger.error(err, '❌ Error in handleLeave')
    socket.emit('error', { message: 'Internal server error' });
  }
};
