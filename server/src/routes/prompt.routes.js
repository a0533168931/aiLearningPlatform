/**
 * Prompt Routes
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/prompt.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

/**
 * Create prompt
 */
router.post(
  '/create',
  auth,
  validate(['categoryId', 'subCategoryId', 'prompt']),
  controller.createPrompt
);

/**
 * User history
 */
router.get(
  '/history/:userId',
  auth,
  validate(['userId'], 'params'),
  controller.getUserHistory
);

/**
 * Prompt by ID
 */
router.get(
  '/promptId/:id',
  auth,
  validate(['id'], 'params'),
  controller.getPromptById
);

/**
 * Filter by category ID
 */
router.get(
  '/categoryId/:categoryId',
  auth,
  validate(['categoryId'], 'params'),
  controller.getPromptsByCategory
);

module.exports = router;
