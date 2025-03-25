import { db } from './src/data/dbClient.js';

beforeAll(async () => {
  if (!db.isOpen) {
    await db.connect();
  }
});

afterAll(async () => {
  if (db.isOpen) {
    await db.quit();
  }
});
