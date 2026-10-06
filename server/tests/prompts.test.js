jest.mock('../src/db/client');
jest.mock('../src/services/ai.service', () => ({
  generateAIResponse: jest.fn(async () => 'mocked answer'),
}));

const request = require('supertest');
const prisma = require('../src/db/client');
const aiService = require('../src/services/ai.service');
const app = require('../src/app');
const { userToken, adminToken, authHeader } = require('./helpers');

const ownedPrompt = {
  id: 9,
  userId: 2,
  categoryId: 1,
  subCategoryId: 3,
  prompt: 'What is a closure?',
  response: 'A closure keeps access to its outer scope.',
  createdAt: '2026-01-01T00:00:00.000Z',
  category: { id: 1, name: 'Programming' },
  subCategory: { id: 3, name: 'JavaScript', categoryId: 1 },
};

describe('Prompts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a prompt when the subcategory belongs to the category', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 2 });
    prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Programming' });
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 3,
      name: 'JavaScript',
      categoryId: 1,
    });
    prisma.prompt.create.mockImplementation(async ({ data }) => ({
      id: 9,
      ...data,
      createdAt: ownedPrompt.createdAt,
    }));

    const res = await request(app)
      .post('/api/prompts/create')
      .set(authHeader(userToken()))
      .send({
        categoryId: 1,
        subCategoryId: 3,
        prompt: 'What is a closure?',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.response).toBe('mocked answer');
    expect(res.body.data.userId).toBe(2);
    expect(aiService.generateAIResponse).toHaveBeenCalledWith({
      categoryName: 'Programming',
      subCategoryName: 'JavaScript',
      prompt: 'What is a closure?',
    });
  });

  test('rejects a subcategory that belongs to another category', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 2 });
    prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Programming' });
    prisma.subCategory.findUnique.mockResolvedValue({
      id: 8,
      name: 'Physics',
      categoryId: 4,
    });

    const res = await request(app)
      .post('/api/prompts/create')
      .set(authHeader(userToken()))
      .send({
        categoryId: 1,
        subCategoryId: 8,
        prompt: 'Explain gravity',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Subcategory does not belong to the selected category'
    );
    expect(aiService.generateAIResponse).not.toHaveBeenCalled();
    expect(prisma.prompt.create).not.toHaveBeenCalled();
  });

  test('a user cannot read another user prompt', async () => {
    prisma.prompt.findUnique.mockResolvedValue({
      ...ownedPrompt,
      userId: 5,
      response: 'hidden answer',
    });

    const res = await request(app)
      .get('/api/prompts/promptId/9')
      .set(authHeader(userToken()));

    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).not.toContain('hidden answer');
  });

  test('an admin can read another user prompt', async () => {
    prisma.prompt.findUnique.mockResolvedValue({
      ...ownedPrompt,
      userId: 5,
    });

    const res = await request(app)
      .get('/api/prompts/promptId/9')
      .set(authHeader(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body.data.userId).toBe(5);
    expect(res.body.data.prompt).toBe('What is a closure?');
  });

  test('category history returns only the current user prompts', async () => {
    prisma.prompt.findMany.mockResolvedValue([ownedPrompt]);

    const res = await request(app)
      .get('/api/prompts/categoryId/1')
      .set(authHeader(userToken()));

    expect(res.status).toBe(200);
    expect(prisma.prompt.findMany.mock.calls[0][0].where).toEqual({
      categoryId: 1,
      userId: 2,
    });
    expect(res.body.data).toEqual([ownedPrompt]);
  });

  test('an admin can read every prompt in a category', async () => {
    prisma.prompt.findMany.mockResolvedValue([
      ownedPrompt,
      { ...ownedPrompt, id: 10, userId: 5 },
    ]);

    const res = await request(app)
      .get('/api/prompts/categoryId/1')
      .set(authHeader(adminToken()));

    expect(res.status).toBe(200);
    expect(prisma.prompt.findMany.mock.calls[0][0].where).toEqual({
      categoryId: 1,
    });
    expect(res.body.data).toHaveLength(2);
  });
});
