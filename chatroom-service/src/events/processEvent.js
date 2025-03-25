import { handleJoin } from './handlers/handleJoin.js';
import { handleLeave } from './handlers/handleLeave.js';
import { handleMessage } from './handlers/handleMessage.js';

export const processEvent = async (event, socket, io) => {
  const { eventType } = event;

  try {
    switch (eventType) {
      case 'join':
        return await handleJoin(event, socket, io);
      case 'leave':
        return await handleLeave(event, socket, io);
      case 'message':
        return await handleMessage(event, socket, io);
      default:
        console.warn('⚠️ Unknown event type:', eventType);
    }
  } catch (err) {
    console.error(`❌ Failed to process ${eventType}:`, err);
  }
};
