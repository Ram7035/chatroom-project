import request from 'supertest';
import { db } from '../data/dbClient.js';
import { shutdownSocketRedisAdapter } from '../socket/redisAdapter.js';
import { app } from '../app.js';

afterAll(async () => {
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
