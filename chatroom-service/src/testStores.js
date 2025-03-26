// src/testStores.js
import { addUserToRoom, removeUserFromRoom, getActiveUsersInRoom } from './data/stores/userStore.js';
import { storeMessage, getLastMessages } from './data/stores/messageStore.js';
import { db } from './data/dbClient.js';
import { logger } from './utils/logger.js';

const testRedisStores = async () => {
  await db.connect(); // ✅ Connect to db before doing anything

  const roomId = 'test-room';
  const userId = 'u123';

  logger.info('➡️ Add user');
  await addUserToRoom(roomId, userId);

  logger.info('👥 Active users:', await getActiveUsersInRoom(roomId));

  logger.info('💬 Store messages');
  await storeMessage(roomId, { userId, message: 'Hello Redis!', timestamp: new Date().toISOString() });
  await storeMessage(roomId, { userId, message: 'How are you?', timestamp: new Date().toISOString() });

  const messages = await getLastMessages(roomId, 2);
  logger.info('📜 Chat History:', messages);

  logger.info('⛔ Remove user');
  await removeUserFromRoom(roomId, userId);
  logger.info('👥 Active users (after removal):', await getActiveUsersInRoom(roomId));
};

testRedisStores()
  .then(() => {
    logger.info('✅ Redis test completed');
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err, '❌ Redis test failed');
    process.exit(1);
  });
