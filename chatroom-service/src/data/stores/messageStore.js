import { db } from '../dbClient.js';

const getMessageKey = (chatRoomId) => `chatroom:${chatRoomId}:messages`;
const MAX_HISTORY = 100; // Keep last 100 messages per room

export const storeMessage = async (chatRoomId, message) => {
  const serialized = JSON.stringify(message);
  await db.rPush(getMessageKey(chatRoomId), serialized);
  await db.lTrim(getMessageKey(chatRoomId), -MAX_HISTORY, -1); // Keep last N
};

export const getLastMessages = async (chatRoomId, limit = 50) => {
  const rawMessages = await db.lRange(getMessageKey(chatRoomId), -limit, -1);
  return rawMessages.map((msg) => JSON.parse(msg));
};
