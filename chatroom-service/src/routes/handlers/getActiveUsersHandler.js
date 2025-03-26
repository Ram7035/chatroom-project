import { getActiveUsersInRoom } from '../../data/stores/userStore.js';
import { logger } from '../../utils/logger.js';

/**
 * GET /active-users/:chatRoomId
 * Returns the list of active users in a chatroom.
 */
export const getActiveUsersHandler = async (req, res) => {
  const { chatRoomId } = req.params;

  if (!chatRoomId) {
    return res.status(400).json({ error: 'Missing chatRoomId' });
  }

  try {
    const users = await getActiveUsersInRoom(chatRoomId);
    res.status(200).json({ users });
  } catch (err) {
    logger.error(err, '❌ Failed to get active users')
    res.status(500).json({ error: 'Failed to get active users' });
  }
};
