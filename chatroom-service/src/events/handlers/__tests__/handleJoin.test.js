import { handleJoin } from '../handleJoin.js';
import * as userStore from '../../../data/stores/userStore.js';

jest.mock('../../../data/stores/userStore.js');

describe('handleJoin', () => {
  const emitMock = jest.fn()
  const mockSocket = {
    join: jest.fn(),
    to: jest.fn(() => ({ emit: emitMock })),
    emit: jest.fn(),
  };

  const event = {
    eventType: 'join',
    userId: 'u1',
    chatRoomId: 'room1',
    timestamp: new Date().toISOString(),
  };

  it('should join a user to a room and emit events', async () => {
    userStore.getActiveUsersInRoom.mockResolvedValue(['u1', 'u2']);

    await handleJoin(event, mockSocket, null);

    expect(userStore.addUserToRoom).toHaveBeenCalledWith('room1', 'u1');
    expect(mockSocket.join).toHaveBeenCalledWith('room1');
    expect(mockSocket.to).toHaveBeenCalledWith('room1');
    expect(emitMock).toHaveBeenCalledWith('user:joined',
      expect.objectContaining({
        userId: 'u1',
        chatRoomId: 'room1',
        timestamp: expect.any(String),
      }));
    expect(mockSocket.emit).toHaveBeenCalledWith('room:active-users', {
      chatRoomId: 'room1',
      users: ['u1', 'u2'],
    });
  });
});
