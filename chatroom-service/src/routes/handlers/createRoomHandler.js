import { createRoom } from '../../data/stores/roomStore.js';
import { logger } from '../../utils/logger.js';

export const createRoomHandler = async (req, res) => {
  const { roomId, name, createdBy } = req.body;

  if (!roomId || !name || !createdBy) {
    return res.status(400).json({ error: 'Missing roomId, name, or createdBy' });
  }

  try {
    await createRoom(roomId, name, createdBy);
    res.status(201).json({ success: true });
  } catch (err) {
    logger.error(err, 'Error creating room');
    res.status(500).json({ error: 'Internal server error' });
  }
};
