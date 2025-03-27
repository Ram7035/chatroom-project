import { getAllRooms } from '../../data/stores/roomStore.js';
import { logger } from '../../utils/logger.js';

export const getRoomsHandler = async (_req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json(rooms);
  } catch (err) {
    logger.error('Error retrieving rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
