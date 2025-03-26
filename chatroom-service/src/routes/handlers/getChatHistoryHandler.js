import { getLastMessages } from '../../data/stores/messageStore.js';
import { logger } from '../../utils/logger.js';

/**
 * GET /chat-history/:chatRoomId?limit=N
 * Returns the last N messages from a chatroom.
 */
export const getChatHistoryHandler = async (req, res) => {
  const { chatRoomId } = req.params;
  const limit = parseInt(req.query.limit || '50', 10);

  if (!chatRoomId) {
    return res.status(400).json({ error: 'Missing chatRoomId' });
  }

  try {
    const messages = await getLastMessages(chatRoomId, limit);
    res.status(200).json({ chatRoomId, messages });
  } catch (err) {
    logger.error(err, '❌ Failed to get chat history')
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};
