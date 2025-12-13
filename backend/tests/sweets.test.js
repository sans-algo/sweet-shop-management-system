import request from 'supertest';
import app from '../server.js';
import { mongoose } from '../config/db.js';

afterAll(async () => {
  await mongoose.connection.close();
});


describe('Sweets API', () => {
  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(401);
  });
});
