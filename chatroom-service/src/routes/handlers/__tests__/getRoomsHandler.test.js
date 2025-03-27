import request from 'supertest';
import express from 'express';
import { getRoomsHandler } from '../getRoomsHandler.js';

const app = express();
app.get('/rooms', getRoomsHandler);

describe('GET /rooms', () => {
  it('should return an array of rooms', async () => {
    const res = await request(app).get('/rooms');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
