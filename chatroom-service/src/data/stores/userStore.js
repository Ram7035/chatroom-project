// src/data/stores/userStore.js
import { db } from '../dbClient.js';

const getUserKey = (chatRoomId) => `chatroom:${chatRoomId}:users`;

export const addUserToRoom = async (chatRoomId, userId) => {
  await db.sAdd(getUserKey(chatRoomId), userId);
};

export const removeUserFromRoom = async (chatRoomId, userId) => {
  await db.sRem(getUserKey(chatRoomId), userId);
};

export const getActiveUsersInRoom = async (chatRoomId) => {
  return await db.sMembers(getUserKey(chatRoomId));
};
