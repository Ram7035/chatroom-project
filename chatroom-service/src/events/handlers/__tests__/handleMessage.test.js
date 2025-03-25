import { handleMessage } from '../handleMessage.js';
import * as messageStore from '../../../data/stores/messageStore.js';

jest.mock('../../../data/stores/messageStore.js');

describe('handleMessage', () => {
  const emitMock = jest.fn();
  const toMock = jest.fn(() => ({ emit: emitMock }));
  const mockIo = { to: toMock };

  const event = {
    eventType: 'message',
    userId: 'u1',
    chatRoomId: 'room1',
    message: 'Hello',
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store and broadcast a message', async () => {
    await handleMessage(event, null, mockIo);

    expect(messageStore.storeMessage).toHaveBeenCalledWith('room1', {
      userId: 'u1',
      message: 'Hello',
      timestamp: expect.any(String),
    });

    expect(toMock).toHaveBeenCalledWith('room1');
    expect(emitMock).toHaveBeenCalledWith(
      'chat:message',
      expect.objectContaining({
        userId: 'u1',
        message: 'Hello',
        chatRoomId: 'room1',
        timestamp: expect.any(String),
      })
    );
  });
});
