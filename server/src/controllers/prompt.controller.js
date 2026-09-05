/**
 * Prompt Controller
 */
const service = require('../services/prompt.service');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

/**
 * Create prompt
 * POST /api/prompts/create
 * userId is taken from the authenticated token, not the request body.
 */
const createPrompt = asyncHandler(async (req, res) => {
  const result = await service.createPrompt({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

/**
 * Get user history
 * GET /api/prompts/history/:userId
 * Users may only read their own history; admins may read any user's history.
 */
const getUserHistory = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);

  if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
    throw httpError(403, 'Access denied.');
  }

  const data = await service.getUserHistory(userId);

  res.status(200).json({
    status: 'success',
    data,
  });
});

/**
 * Get prompt by ID
 * GET /api/prompts/promptId/:id
 */
const getPromptById = asyncHandler(async (req, res) => {
  const data = await service.getPromptById(Number(req.params.id));

  res.status(200).json({
    status: 'success',
    data,
  });
});

/**
 * Get prompts by category
 * GET /api/prompts/categoryId/:categoryId
 */
const getPromptsByCategory = asyncHandler(async (req, res) => {
  const data = await service.getPromptsByCategory(
    Number(req.params.categoryId)
  );

  res.status(200).json({
    status: 'success',
    data,
  });
});

module.exports = {
  createPrompt,
  getUserHistory,
  getPromptById,
  getPromptsByCategory,
};
