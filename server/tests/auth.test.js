jest.mock('../src/db/client');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../src/db/client');
const app = require('../src/app');

const publicUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'USER',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('valid registration returns user + token and hashes the password', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data, select }) => {
      const created = {
        id: 1,
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        createdAt: publicUser.createdAt,
        updatedAt: publicUser.updatedAt,
      };

      if (!select) return created;

      const picked = {};
      for (const key of Object.keys(select)) {
        if (select[key]) picked[key] = created[key];
      }
      return picked;
    });

    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'John@Example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    });
    expect(res.body.token).toEqual(expect.any(String));
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
    expect(JSON.stringify(res.body)).not.toMatch(/"password":"Password123!"/);

    const createArg = prisma.user.create.mock.calls[0][0];
    expect(createArg.data.role).toBe('USER');
    expect(createArg.data.email).toBe('john@example.com');
    expect(createArg.data.passwordHash).not.toBe('Password123!');
    expect(createArg.data.passwordHash.startsWith('$2')).toBe(true);
    expect(await bcrypt.compare('Password123!', createArg.data.passwordHash)).toBe(
      true
    );
  });

  test('invalid email returns 400', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'not-an-email',
      password: 'Password123!',
    });

    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test('missing password returns 400', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/password/i);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test('duplicate email returns 409', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'john@example.com' });

    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test('registration ignores a client-supplied role', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(publicUser);

    await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      role: 'ADMIN',
    });

    expect(prisma.user.create.mock.calls[0][0].data.role).toBe('USER');
  });
});

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('valid credentials return JWT with role and no passwordHash', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    prisma.user.findUnique.mockResolvedValue({
      ...publicUser,
      passwordHash,
    });

    const res = await request(app).post('/api/users/login').send({
      email: 'john@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({
      email: 'john@example.com',
      role: 'USER',
    });
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');

    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload.role).toBe('USER');
    expect(payload.email).toBe('john@example.com');
    expect(payload.password).toBeUndefined();
    expect(payload.passwordHash).toBeUndefined();
  });

  test('wrong password returns 401', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    prisma.user.findUnique.mockResolvedValue({
      ...publicUser,
      passwordHash,
    });

    const res = await request(app).post('/api/users/login').send({
      email: 'john@example.com',
      password: 'WrongPass1',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password.');
  });

  test('unknown email returns 401 without revealing that the email is missing', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post('/api/users/login').send({
      email: 'missing@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password.');
  });
});
