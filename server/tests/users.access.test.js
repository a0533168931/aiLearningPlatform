jest.mock('../src/db/client');

const request = require('supertest');
const prisma = require('../src/db/client');
const app = require('../src/app');
const { userToken, adminToken, authHeader } = require('./helpers');

const learner = {
  id: 2,
  name: 'Learner',
  email: 'user@example.com',
  role: 'USER',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('User profile access', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('a user can view their own profile', async () => {
    prisma.user.findUnique.mockResolvedValue(learner);

    const res = await request(app)
      .get('/api/users/view/2')
      .set(authHeader(userToken()));

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      id: 2,
      email: 'user@example.com',
    });
  });

  test('a user cannot view another user profile', async () => {
    const res = await request(app)
      .get('/api/users/view/1')
      .set(authHeader(userToken()));

    expect(res.status).toBe(403);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test('an admin can view another user profile', async () => {
    prisma.user.findUnique.mockResolvedValue(learner);

    const res = await request(app)
      .get('/api/users/view/2')
      .set(authHeader(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@example.com');
  });
});
