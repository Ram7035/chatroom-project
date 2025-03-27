import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!username) return;
    navigate(`/rooms?user=${encodeURIComponent(username)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Enter Chatroom</h1>
      <input
        type="text"
        placeholder="Your name"
        className="px-4 py-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enter
      </button>
    </div>
  );
}
