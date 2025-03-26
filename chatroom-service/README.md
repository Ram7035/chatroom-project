# 💬 Chatroom Microservice

A scalable real-time chatroom microservice built with **Node.js**, **WebSockets**, **Redis**, and **Kafka**. Designed to support **10,000+ chatrooms** and **50,000+ simultaneous users**, with message broadcasting, active user tracking, and resilient multi-instance architecture.

---

## 🚀 Features

- Real-time messaging via **Socket.IO**
- REST APIs for active users and chat history
- **Redis** for in-memory storage of users and messages
- **Redis Adapter** for socket sync across instances
- **Kafka** for cross-instance message broadcasting
- Horizontally scalable with **NGINX load balancer**
- Fully Dockerized (optional `docker-compose`)
- Load-tested for concurrency and performance

---

## 📂 Project Structure

```
src/
├── app.js                     # Express + WebSocket app
├── index.js                   # Entrypoint (runs app.js)
├── socket/                    # WebSocket event router
├── events/handlers/          # Chat event handlers (join, message, leave)
├── routes/handlers/          # REST API handlers
├── data/                     # Redis, Kafka clients
├── constants/                # Event name constants
├── utils/                    # Logger, helpers
```

---

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/Ram7035/chatroom-project.git
cd chatroom-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis, Kafka, and services

```bash
docker-compose up --build
```

### 4. Run in dev mode

```bash
npm run dev
```

### 5. Run tests

```bash
npm test
```

---

## 🔗 API Endpoints

### `GET /active-users/:chatRoomId`

Returns a list of currently active users in a chatroom.

```json
{
  "chatRoomId": "room1",
  "users": ["user1", "user2"]
}
```

---

### `GET /chat-history/:chatRoomId?limit=50`

Returns the last `N` messages from a specific chatroom.

```json
{
  "chatRoomId": "room1",
  "messages": [
    {
      "userId": "user1",
      "message": "Hello",
      "timestamp": "2025-03-25T10:00:00.000Z"
    }
  ]
}
```

---

## 🧩 WebSocket Events

### `chat:event`

Sent by the client. Payload:

```json
{
  "eventType": "join | message | leave",
  "userId": "user123",
  "chatRoomId": "room1",
  "message": "Optional if message event",
  "timestamp": "ISO string"
}
```

### `chat:message`

Broadcasted by server to everyone in a chatroom.

### `user:joined` / `user:left`

Emitted to others in the room when someone joins/leaves.

---

## ⚙️ Architecture Overview

Client (Socket.IO + REST)
        │
        ▼
┌───────────────────┐
│     NGINX LB      │
│ (round-robin load)│
└───────────────────┘
        │
        ▼
 ┌──────────────┐        ┌──────────────┐
 │  Server #1   │        │  Server #2   │
 │ (Express +   │        │ (Express +   │
 │  Socket.IO)  │        │  Socket.IO)  │
 └──────┬───────┘        └──────┬───────┘
        │                       │
        ├────────────┬──────────┤
        ▼            ▼          ▼
  Redis Adapter   Kafka Producer  (Send message)
  (Sync sockets)   (Publish to topic)
        │                       │
        ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│     Redis DB     │    │      Kafka       │
│(Users + Messages)│    │  (pub/sub topic) │
└──────────────────┘    └──────────────────┘
                             ▲
                             │
         ┌───────────────────┘
         │ Kafka Consumer (All Servers)
         ▼
   io.to(chatRoomId).emit('chat:message')

---

## 🧪 Load Testing Summary

- **32,000 simulated users** across **10,000 chatrooms**
- All users joined rooms successfully
- No disconnections or memory issues
- Kafka handled ~1,000 messages/sec
- Redis Adapter ensured cross-instance broadcast

---

## ♻️ Resilience Notes

- If a Node.js server crashes, clients reconnect to a healthy instance via NGINX
- Redis Adapter syncs socket state across servers
- Kafka ensures messages are not lost (even if an instance fails)
- Load balancer distributes connections evenly

---

## ✅ Bonus Highlights

| Feature | Implemented |
|--------|-------------|
| WebSocket broadcasting | ✅ Yes |
| Redis for horizontal scaling | ✅ Yes |
| Kafka for pub/sub messaging | ✅ Yes |
| REST API fallback | ✅ Yes |
| Load-balanced setup (NGINX) | ✅ Yes |
| Docker Compose | ✅ Yes |
| Load test script | ✅ Yes |
| Test coverage (Jest) | ✅ Yes |
| Logging with `pino` | ✅ Yes |

---

## 🧱 Assumptions & Limitations

- In-memory Redis used for active users and history — messages are not persisted across restarts
- Kafka only used for cross-server message delivery, not persistence
- Auth/session management is not included (can be layered later)

---

## 📹 Demo

> A sample demo video can be recorded showing:
> - Two browser tabs joining different servers
> - Real-time message sync
> - Load test logs with 32K users
> - Redis + Kafka logs confirming scale
