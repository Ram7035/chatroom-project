import { getLastMessages } from '../../data/stores/messageStore.js';

export async function getChatHistoryHandler(req, res) {
  const { chatRoomId } = req.params;
  const limit = parseInt(req.query.limit) || 50;

  if (!chatRoomId) {
    return res.status(400).json({ error: 'chatRoomId is required' });
  }

  try {
    const messages = await getLastMessages(chatRoomId, limit);
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
