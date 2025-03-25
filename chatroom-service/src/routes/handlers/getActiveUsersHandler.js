import { getActiveUsersInRoom } from '../../data/stores/userStore.js';

export async function getActiveUsersHandler(req, res) {
  const { chatRoomId } = req.params;

  if (!chatRoomId) {
    return res.status(400).json({ error: 'chatRoomId is required' });
  }

  try {
    const users = await getActiveUsersInRoom(chatRoomId);
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching active users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
