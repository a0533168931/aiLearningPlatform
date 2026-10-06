jest.mock('../src/db/client');

const request = require('supertest');
const prisma = require('../src/db/client');
const app = require('../src/app');
const { userToken, authHeader } = require('./helpers');

describe('AI availability', () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  afterAll(() => {
    if (originalKey) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });

  test('creating a prompt returns 503 when OpenAI is not configured', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 2 });
    prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Programming' });
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 3,
      name: 'JavaScript',
      categoryId: 1,
    });

    const res = await request(app)
      .post('/api/prompts/create')
      .set(authHeader(userToken()))
      .send({
        categoryId: 1,
        subCategoryId: 3,
        prompt: 'What is a closure?',
      });

    expect(res.status).toBe(503);
    expect(res.body.message).toBe('AI service is not configured');
    expect(prisma.prompt.create).not.toHaveBeenCalled();
  });

  test('other endpoints keep working when OpenAI is not configured', async () => {
    prisma.category.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual([]);
  });
});
