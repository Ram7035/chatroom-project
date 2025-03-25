import { getActiveUsersHandler } from '../getActiveUsersHandler.js';
import * as userStore from '../../../data/stores/userStore.js';

describe('getActiveUsersHandler', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { chatRoomId: 'room1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return active users from Redis', async () => {
    const mockUsers = ['user1', 'user2'];
    jest.spyOn(userStore, 'getActiveUsersInRoom').mockResolvedValue(mockUsers);

    await getActiveUsersHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
  });

  it('should return 400 if chatRoomId is missing', async () => {
    req.params = {}; // no chatRoomId

    await getActiveUsersHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'chatRoomId is required' });
  });

  it('should return 500 on internal error', async () => {
    jest.spyOn(userStore, 'getActiveUsersInRoom').mockRejectedValue(new Error('Redis failure'));

    await getActiveUsersHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
