import express from 'express';
import { getActiveUsersHandler } from './handlers/getActiveUsersHandler.js';
import { getChatHistoryHandler } from './handlers/getChatHistoryHandler.js';

const router = express.Router();

router.get('/active-users/:chatRoomId', getActiveUsersHandler);
router.get('/chat-history/:chatRoomId', getChatHistoryHandler);

export default router;