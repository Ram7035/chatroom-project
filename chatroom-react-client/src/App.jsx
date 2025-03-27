import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RoomList from './pages/RoomList';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/rooms/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
