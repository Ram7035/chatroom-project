import { removeUserFromRoom, getActiveUsersInRoom } from '../../data/stores/userStore.js';

export const handleLeave = async (event, socket, io) => {
  const { userId, chatRoomId, timestamp } = event;

  if (!userId || !chatRoomId) {
    throw new Error('Missing userId or chatRoomId in leave event');
  }

  await removeUserFromRoom(chatRoomId, userId);
  socket.leave(chatRoomId);

  console.log(`👋 User ${userId} left room ${chatRoomId}`);

  // Notify others in the room
  socket.to(chatRoomId).emit('user:left', {
    userId,
    chatRoomId,
    timestamp,
  });

  // Optional: send updated user list to remaining users
  const users = await getActiveUsersInRoom(chatRoomId);
  io.to(chatRoomId).emit('room:active-users', {
    chatRoomId,
    users,
  });
};
