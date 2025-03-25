// src/index.js
import { createApp } from './app.js';
import { shutdownSocketRedisAdapter } from './socket/socketSetup.js';
import { db } from './data/dbClient.js'

const PORT = process.env.PORT || 3000;

const { server } = await createApp();

server.listen(PORT, () => {
  console.log(`🚀 Chatroom service running on http://localhost:${PORT}`);
});

// Graceful shutdown on Ctrl+C or SIGTERM
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  console.log('\n🧼 Gracefully shutting down...');
  await shutdownSocketRedisAdapter();
  if (db.isOpen) await db.quit();
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
}
