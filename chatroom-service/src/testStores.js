// src/testStores.js
import { addUserToRoom, removeUserFromRoom, getActiveUsersInRoom } from './data/stores/userStore.js';
import { storeMessage, getLastMessages } from './data/stores/messageStore.js';
import { db } from './data/dbClient.js';

const testRedisStores = async () => {
  await db.connect(); // ✅ Connect to db before doing anything

  const roomId = 'test-room';
  const userId = 'u123';

  console.log('➡️ Add user');
  await addUserToRoom(roomId, userId);

  console.log('👥 Active users:', await getActiveUsersInRoom(roomId));

  console.log('💬 Store messages');
  await storeMessage(roomId, { userId, message: 'Hello Redis!', timestamp: new Date().toISOString() });
  await storeMessage(roomId, { userId, message: 'How are you?', timestamp: new Date().toISOString() });

  const messages = await getLastMessages(roomId, 2);
  console.log('📜 Chat History:', messages);

  console.log('⛔ Remove user');
  await removeUserFromRoom(roomId, userId);
  console.log('👥 Active users (after removal):', await getActiveUsersInRoom(roomId));
};

testRedisStores()
  .then(() => {
    console.log('✅ Redis test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Redis test failed:', err);
    process.exit(1);
  });
