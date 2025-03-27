import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const username = params.get('user');

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:8080/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomId || !roomName || !username) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/rooms', {
        roomId,
        name: roomName,
        createdBy: username,
      });
      setRoomId('');
      setRoomName('');
      fetchRooms(); // refresh
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    const interval = setInterval(fetchRooms, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>

      <div className="bg-white rounded p-4 shadow space-y-2">
        <h2 className="font-semibold text-lg">Create a Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Room ID (e.g., general)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="font-semibold text-lg mb-2">Available Rooms</h2>
        {rooms.length === 0 && <p className="text-gray-500">No rooms yet.</p>}
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.roomId}
              className="border rounded p-2 flex justify-between items-center"
            >
              <span>
                <strong>{room.name}</strong> ({room.roomId})
              </span>
              <button
                onClick={() =>
                  window.location.href = `/rooms/${room.roomId}?user=${encodeURIComponent(username)}`
                }    
                className="text-blue-600 underline"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
