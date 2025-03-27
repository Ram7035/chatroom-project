import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  upgrade: false
});

export default function ChatRoom() {
  const { roomId } = useParams();
  const [params] = useSearchParams();
  const username = params.get('user');
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchActiveUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/active-users/${roomId}`);
      setActiveUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/chat-history/${roomId}?limit=50`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit('chat:event', {
      eventType: 'message',
      userId: username,
      chatRoomId: roomId,
      message: input,
      timestamp: new Date().toISOString(),
    });

    setInput('');
  };

  useEffect(() => {
    fetchActiveUsers();
    fetchMessages();
  
    socket.emit('chat:event', {
      eventType: 'join',
      userId: username,
      chatRoomId: roomId,
      timestamp: new Date().toISOString(),
    });
  
    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });
  
    socket.on('user:joined', fetchActiveUsers);
    socket.on('user:left', fetchActiveUsers);
  
    const interval = setInterval(fetchActiveUsers, 5000);
  
    const handleBeforeUnload = () => {
      socket.emit('chat:event', {
        eventType: 'leave',
        userId: username,
        chatRoomId: roomId,
        timestamp: new Date().toISOString(),
      });
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      clearInterval(interval);
      socket.emit('chat:event', {
        eventType: 'leave',
        userId: username,
        chatRoomId: roomId,
        timestamp: new Date().toISOString(),
      });
      socket.off();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomId]);
  

  return (
    <div className="flex h-screen">
      {/* Chat section */}
      <div className="flex-1 p-4 flex flex-col bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded shadow">
              <div className="text-sm text-gray-600">
                <strong>{msg.userId}</strong> — {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div>{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-3 py-2 rounded border"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      {/* Sidebar: Active users */}
      <div className="w-64 bg-white border-l p-4">
        <h3 className="font-semibold text-lg mb-2">Active Users</h3>
        <ul className="space-y-1">
          {activeUsers.map((user) => (
            <li key={user} className="text-gray-800">{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
