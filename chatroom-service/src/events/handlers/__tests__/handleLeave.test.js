import { handleLeave } from '../handleLeave.js';
import * as userStore from '../../../data/stores/userStore.js';

jest.mock('../../../data/stores/userStore.js');

describe('handleLeave', () => {
  const emitMock = jest.fn();
  const toMock = jest.fn(() => ({ emit: emitMock }));

  const mockSocket = {
    leave: jest.fn(),
    to: toMock, // local .to() for socket.to().emit
  };

  const mockIo = {
    to: toMock, // global io.to().emit
  };

  const event = {
    eventType: 'leave',
    userId: 'u1',
    chatRoomId: 'room1',
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.getActiveUsersInRoom.mockResolvedValue(['u2']);
  });

  it('should remove user from room and emit updates', async () => {
    await handleLeave(event, mockSocket, mockIo);

    expect(userStore.removeUserFromRoom).toHaveBeenCalledWith('room1', 'u1');
    expect(mockSocket.leave).toHaveBeenCalledWith('room1');

    // Sent to other users in the room (socket.to().emit)
    expect(toMock).toHaveBeenCalledWith('room1');
    expect(emitMock).toHaveBeenCalledWith(
      'user:left',
      expect.objectContaining({
        userId: 'u1',
        chatRoomId: 'room1',
        timestamp: expect.any(String),
      })
    );

    // Broadcast updated user list to entire room (io.to().emit)
    expect(toMock).toHaveBeenCalledWith('room1');
    expect(emitMock).toHaveBeenCalledWith(
      'room:active-users',
      expect.objectContaining({
        chatRoomId: 'room1',
        users: ['u2'],
      })
    );
  });
});
