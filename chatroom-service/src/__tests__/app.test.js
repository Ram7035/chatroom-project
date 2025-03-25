import request from 'supertest';
import { createApp } from '../app.js';
import { db } from '../data/dbClient.js';
import { shutdownSocketRedisAdapter } from '../socket/socketSetup.js';

let app;
let server;

beforeAll(async () => {
  const setup = await createApp();
  app = setup.app;
  server = setup.server;
  server.listen(0); // bind to ephemeral port
});

afterAll(async () => {
    if (server && typeof server.close === 'function') {
      await new Promise((resolve) => server.close(resolve));
    }
  
    if (db && db.isOpen) {
      await db.quit();
    }
  
    await shutdownSocketRedisAdapter(); // ✅ Close pub/sub clients
  });

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Chatroom microservice is running!');
  });
});
