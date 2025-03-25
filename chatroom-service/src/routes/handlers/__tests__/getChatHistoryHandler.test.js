import { getChatHistoryHandler } from '../getChatHistoryHandler.js';
import * as messageStore from '../../../data/stores/messageStore.js';

describe('getChatHistoryHandler', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { chatRoomId: 'room1' },
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return last messages with default limit', async () => {
    const mockMessages = [
      { userId: 'u1', message: 'Hi', timestamp: '2025-03-23T17:00:00Z' },
      { userId: 'u2', message: 'Hello', timestamp: '2025-03-23T17:01:00Z' }
    ];

    jest.spyOn(messageStore, 'getLastMessages').mockResolvedValue(mockMessages);

    await getChatHistoryHandler(req, res);

    expect(messageStore.getLastMessages).toHaveBeenCalledWith('room1', 50); // default limit
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ messages: mockMessages });
  });

  it('should return messages with custom limit', async () => {
    req.query.limit = '5';

    jest.spyOn(messageStore, 'getLastMessages').mockResolvedValue([]);

    await getChatHistoryHandler(req, res);

    expect(messageStore.getLastMessages).toHaveBeenCalledWith('room1', 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ messages: [] });
  });

  it('should return 400 if chatRoomId is missing', async () => {
    req.params = {};

    await getChatHistoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'chatRoomId is required' });
  });

  it('should return 500 on internal error', async () => {
    jest.spyOn(messageStore, 'getLastMessages').mockRejectedValue(new Error('Redis error'));

    await getChatHistoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
