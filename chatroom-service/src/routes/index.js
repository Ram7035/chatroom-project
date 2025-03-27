import express from 'express';
import {
  getActiveUsersHandler,
  getChatHistoryHandler,
  getRoomsHandler,
  createRoomHandler
} from './handlers/index.js';

const router = express.Router();

router.get('/active-users/:chatRoomId', getActiveUsersHandler);
router.get('/chat-history/:chatRoomId', getChatHistoryHandler);
router.get('/rooms', getRoomsHandler);
router.post('/rooms', createRoomHandler);

export default router;
