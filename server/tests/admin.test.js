jest.mock('../src/db/client');

const request = require('supertest');
const prisma = require('../src/db/client');
const app = require('../src/app');
const { userToken, adminToken, authHeader } = require('./helpers');

describe('Admin authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('unauthenticated request gets 401', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .send({ name: 'Artificial Intelligence' });

    expect(res.status).toBe(401);
  });

  test('authenticated non-admin gets 403', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set(authHeader(userToken()))
      .send({ name: 'Artificial Intelligence' });

    expect(res.status).toBe(403);
  });

  test('USER cannot access admin endpoints', async () => {
    const res = await request(app)
      .delete('/api/admin/categories/1')
      .set(authHeader(userToken()));

    expect(res.status).toBe(403);
  });

  test('ADMIN can access admin endpoints', async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    prisma.category.create.mockResolvedValue({
      id: 1,
      name: 'Artificial Intelligence',
      createdAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/admin/categories')
      .set(authHeader(adminToken()))
      .send({ name: 'Artificial Intelligence' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Artificial Intelligence');
  });
});
