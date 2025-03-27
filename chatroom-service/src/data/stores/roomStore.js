import { db } from '../dbClient.js';

const ROOM_INDEX_KEY = 'chat:rooms';

export async function createRoom(roomId, name, createdBy) {
  const roomKey = `chat:room:${roomId}`;
  const roomData = {
    name,
    createdBy,
    createdAt: new Date().toISOString()
  };

  await db.hSet(roomKey, roomData);
  await db.sAdd(ROOM_INDEX_KEY, roomId);
}

export async function getAllRooms() {
  const roomIds = await db.sMembers(ROOM_INDEX_KEY);

  const pipeline = db.multi();
  for (const roomId of roomIds) {
    pipeline.hGetAll(`chat:room:${roomId}`);
  }

  const roomDetails = await pipeline.exec();
  return roomIds.map((roomId, index) => ({
    roomId,
    ...roomDetails[index]
  }));
}
