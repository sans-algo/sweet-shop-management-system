import request from 'supertest';
import app from '../server.js';
import { mongoose } from '../config/db.js';

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@test.com`,
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
