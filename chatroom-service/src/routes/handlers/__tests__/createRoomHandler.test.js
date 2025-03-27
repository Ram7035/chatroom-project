import request from 'supertest';
import express from 'express';
import { createRoomHandler } from '../createRoomHandler.js';

const app = express();
app.use(express.json());
app.post('/rooms', createRoomHandler);

describe('POST /rooms', () => {
  it('should create a room successfully', async () => {
    const res = await request(app).post('/rooms').send({
      roomId: 'test-room',
      name: 'Test Room',
      createdBy: 'tester'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/rooms').send({ roomId: 'bad-room' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
