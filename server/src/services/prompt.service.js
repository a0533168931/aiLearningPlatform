
/**
 * Prompt Service
 * Handles business logic and database operations.
 */

require('dotenv').config();
const prisma = require('../db/client');
const aiService = require('./ai.service');
/**
 * Create prompt and save AI response.
 */
const createPrompt = async ({
  userId,
  categoryId,
  subCategoryId,
  prompt,
}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const subCategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
  });

  if (!subCategory) {
    const error = new Error('Subcategory not found');
    error.statusCode = 404;
    throw error;
  }

  const response = await aiService.generateAIResponse({
    categoryName: category.name,
    subCategoryName: subCategory.name,
    prompt,
  });

  return prisma.prompt.create({
    data: {
      userId,
      categoryId,
      subCategoryId,
      prompt,
      response,
    },
  });
};

/**
 * Get all prompts created by a specific user.
 */
const getUserHistory = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const prompts = await prisma.prompt.findMany({
    where: { userId },
    include: {
      category: true,
      subCategory: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return prompts;
};

/**
 * Get a single prompt by ID.
 */
const getPromptById = async (id) => {
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      category: true,
      subCategory: true,
    },
  });

  if (!prompt) {
    const error = new Error('Prompt not found');
    error.statusCode = 404;
    throw error;
  }

  return prompt;
};

/**
 * Get prompts by category.
 */
const getPromptsByCategory = async (categoryId) => {
  return prisma.prompt.findMany({
    where: { categoryId },
    include: {
      category: true,
      subCategory: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

module.exports = {
  createPrompt,
  getUserHistory,
  getPromptById,
  getPromptsByCategory,
};