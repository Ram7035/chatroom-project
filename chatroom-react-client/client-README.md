# 💬 Chatroom Client (React + Tailwind)

This is the frontend client for the **Chatroom Microservice**, built with:

- ⚛️ React (Vite)
- 💨 Tailwind CSS
- 🔌 Socket.IO Client (real-time messaging)
- 🌐 Axios (REST API calls)
- 🌈 Fully URL-driven (no LocalStorage)

---

## 🚀 Features

- ✅ Join as any user via the landing page
- ✅ View and create chatrooms
- ✅ Real-time messaging across instances
- ✅ Chat history and active user lists via REST APIs
- ✅ Multi-tab & multi-user demo support
- ✅ Periodic refresh of room list and active users

---

## 🧪 Requirements

- Node.js v18+
- Backend chatroom service running on `localhost:8080`

---

## 📦 Setup

```bash
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## 🧭 Usage

### 1. Enter a username

- On the landing page (`/`)
- Example: `Alice`, `Bob`

### 2. Create or join a room

- Create a room from the form
- Or join any room listed

### 3. Start chatting

- Chat updates in real-time
- Active users list auto-refreshes
- Messages scroll live

---

## 🌐 URL Structure

You can simulate multiple users using URL parameters:

```
/rooms?user=Alice
/rooms/general?user=Bob
```

---

## 🧹 Project Structure

```
src/
  ├── pages/
  │   ├── Landing.jsx
  │   ├── RoomList.jsx
  │   └── ChatRoom.jsx
  ├── App.jsx
  ├── main.jsx
  └── index.css
```

---

## ✅ Integration Points

| Feature         | API Used                          |
|----------------|------------------------------------|
| Room List       | `GET /rooms`                      |
| Create Room     | `POST /rooms`                     |
| Chat History    | `GET /chat-history/:roomId`       |
| Active Users    | `GET /active-users/:roomId`       |
| Messaging       | `socket.emit('chat:event')`       |
| Broadcasting    | `socket.on('chat:message')`       |

---

## 📦 Production

To build the project:

```bash
npm run build
```

You can serve it with NGINX or any static host.

---

## 📄 License

MIT
