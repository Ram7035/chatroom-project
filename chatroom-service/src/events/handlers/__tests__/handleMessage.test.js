import { handleMessage } from '../handleMessage.js';
import * as messageStore from '../../../data/stores/messageStore.js';
import { kafkaProducer } from '../../../data/kafkaClient.js';

jest.mock('../../../data/kafkaClient.js', () => ({
  kafkaProducer: {
    send: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../../data/stores/messageStore.js');

describe('handleMessage', () => {
  const mockSocket = {
    emit: jest.fn(),
  };

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
    await handleMessage(event, mockSocket);

    expect(messageStore.storeMessage).toHaveBeenCalledWith('room1', {
      userId: 'u1',
      message: 'Hello',
      timestamp: expect.any(String),
    });

    expect(kafkaProducer.send).toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalledWith('error');
  });
});
