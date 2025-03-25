import { addUserToRoom, getActiveUsersInRoom } from '../../data/stores/userStore.js';

export const handleJoin = async (event, socket, _) => {
  const { userId, chatRoomId } = event;

  if (!userId || !chatRoomId) {
    throw new Error('Missing userId or chatRoomId');
  }

  socket.userId = userId;
  socket.chatRoomId = chatRoomId;

  await addUserToRoom(chatRoomId, userId);
  socket.join(chatRoomId);

  console.log(`👤 User ${userId} joined room ${chatRoomId}`);

  // Broadcast join to others in room
  socket.to(chatRoomId).emit('user:joined', {
    userId,
    chatRoomId,
    timestamp: event.timestamp,
  });

  // Optional: Send back current user list to the new user
  const users = await getActiveUsersInRoom(chatRoomId);
  socket.emit('room:active-users', { chatRoomId, users });
};
