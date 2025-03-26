import { handleJoin } from '../events/handlers/handleJoin.js';
import { handleMessage } from '../events/handlers/handleMessage.js';
import { handleLeave } from '../events/handlers/handleLeave.js';
import { EVENTS } from '../constants/events.js';
import { logger } from '../utils/logger.js';

/**
 * Register all socket events for a connected socket.
 * @param {Socket} socket - Connected socket instance
 * @param {Server} io - Socket.IO server instance
 */
export function registerSocketEvents(socket, io) {
  socket.on(EVENTS.CHAT_EVENT, async (event) => {
    switch (event.eventType) {
      case 'join':
        await handleJoin(event, socket, io);
        break;
      case 'message':
        await handleMessage(event, socket, io);
        break;
      case 'leave':
        await handleLeave(event, socket, io);
        break;
      default:
        logger.warn(`🚫 Unknown event type: ${event.eventType}`);
    }
  });
}
