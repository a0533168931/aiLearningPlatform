/**
 * Prompt Controller
 */
const service = require('../services/prompt.service');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * Create prompt
 * POST /api/prompts
 */
const createPrompt = asyncHandler(async (req, res) => {
  const result = await service.createPrompt(req.body);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

/**
 * Get user history
 * GET /api/prompts/user/:userId
 */
const getUserHistory = asyncHandler(async (req, res) => {
  const data = await service.getUserHistory(Number(req.params.userId));

  res.status(200).json({
    status: 'success',
    data,
  });
});

/**
 * Get prompt by ID
 * GET /api/prompts/prompt/:id
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
 * GET /api/prompts/category/:categoryId
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