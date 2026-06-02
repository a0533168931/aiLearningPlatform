/**
 * Prompt Routes
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/prompt.controller');
const validate = require('../middlewares/validate.middleware');

/**
 * Create prompt
 */
router.post(
  '/create',
  validate(['userId', 'categoryId', 'subCategoryId', 'prompt']),
  controller.createPrompt
);

/**
 * User history
 */
router.get(
  '/history/:userId',
  validate(['userId'], 'params'),
  controller.getUserHistory
);
/**
 * Prompt by ID
 */
router.get(
  '/promptId/:id',
  validate(['id'], 'params'),
  controller.getPromptById
);

/**
 * Filter by category ID
 */
router.get(
  '/categoryId/:categoryId',
  validate(['categoryId'], 'params'),
  controller.getPromptsByCategory
);
module.exports = router;