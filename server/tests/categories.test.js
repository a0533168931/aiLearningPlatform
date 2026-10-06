jest.mock('../src/db/client');

const request = require('supertest');
const prisma = require('../src/db/client');
const app = require('../src/app');
const { adminToken, authHeader } = require('./helpers');

const admin = () => authHeader(adminToken());

describe('Category CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create category still works', async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    prisma.category.create.mockResolvedValue({
      id: 1,
      name: 'Programming',
      createdAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/admin/categories')
      .set(admin())
      .send({ name: 'Programming' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Programming');
  });

  test('read categories still works', async () => {
    prisma.category.findMany.mockResolvedValue([
      { id: 1, name: 'Programming', createdAt: new Date().toISOString() },
    ]);

    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test('update category works', async () => {
    prisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: 'Programming',
    });
    prisma.category.findFirst.mockResolvedValue(null);
    prisma.category.update.mockResolvedValue({
      id: 1,
      name: 'Artificial Intelligence',
    });

    const res = await request(app)
      .patch('/api/admin/categories/1')
      .set(admin())
      .send({ name: 'Artificial Intelligence' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Artificial Intelligence');
  });

  test('update missing category returns 404', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .patch('/api/admin/categories/99')
      .set(admin())
      .send({ name: 'Missing' });

    expect(res.status).toBe(404);
  });

  test('duplicate category name returns 409', async () => {
    prisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: 'Programming',
    });
    prisma.category.findFirst.mockResolvedValue({
      id: 2,
      name: 'Artificial Intelligence',
    });

    const res = await request(app)
      .patch('/api/admin/categories/1')
      .set(admin())
      .send({ name: 'Artificial Intelligence' });

    expect(res.status).toBe(409);
  });

  test('delete category works', async () => {
    prisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: 'Programming',
    });
    prisma.category.delete.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .delete('/api/admin/categories/1')
      .set(admin());

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('delete missing category returns 404', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/admin/categories/99')
      .set(admin());

    expect(res.status).toBe(404);
  });
});
