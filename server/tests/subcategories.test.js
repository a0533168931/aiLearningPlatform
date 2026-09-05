jest.mock('../src/db/client');

const request = require('supertest');
const prisma = require('../src/db/client');
const app = require('../src/app');
const { adminToken, authHeader } = require('./helpers');

const admin = () => authHeader(adminToken());

describe('SubCategory CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('update works', async () => {
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 1,
      name: 'JavaScript',
      categoryId: 1,
    });
    prisma.subCategory.findFirst.mockResolvedValue(null);
    prisma.subCategory.update.mockResolvedValue({
      id: 1,
      name: 'Neural Networks',
      categoryId: 1,
    });

    const res = await request(app)
      .patch('/api/admin/categories/subcategories/1')
      .set(admin())
      .send({ name: 'Neural Networks' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Neural Networks');
  });

  test('missing SubCategory returns 404 on update', async () => {
    prisma.subCategory.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .patch('/api/admin/categories/subcategories/99')
      .set(admin())
      .send({ name: 'Neural Networks' });

    expect(res.status).toBe(404);
  });

  test('duplicate name handling works', async () => {
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 1,
      name: 'JavaScript',
      categoryId: 1,
    });
    prisma.subCategory.findFirst.mockResolvedValue({
      id: 2,
      name: 'Neural Networks',
      categoryId: 1,
    });

    const res = await request(app)
      .patch('/api/admin/categories/subcategories/1')
      .set(admin())
      .send({ name: 'Neural Networks' });

    expect(res.status).toBe(409);
  });

  test('delete works', async () => {
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 1,
      name: 'JavaScript',
      categoryId: 1,
    });
    prisma.subCategory.delete.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .delete('/api/admin/categories/subcategories/1')
      .set(admin());

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('missing SubCategory returns 404 on delete', async () => {
    prisma.subCategory.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/admin/categories/subcategories/99')
      .set(admin());

    expect(res.status).toBe(404);
  });
});
