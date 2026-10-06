const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.admin.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/admin.middleware');

const requireAdmin = [auth, adminOnly];

/**
 * Create category
 */
router.post('/', ...requireAdmin, validate(['name']), controller.createCategory);

/**
 * Create subcategory
 */
router.post(
  '/subcategories',
  ...requireAdmin,
  validate(['categoryId', 'name']),
  controller.createSubCategory
);

/**
 * Update subcategory — registered before /:id so "subcategories" is not captured as an id
 */
router.patch(
  '/subcategories/:id',
  ...requireAdmin,
  validate(['id'], 'params'),
  validate(['name']),
  controller.updateSubCategory
);

/**
 * Delete subcategory
 */
router.delete(
  '/subcategories/:id',
  ...requireAdmin,
  validate(['id'], 'params'),
  controller.deleteSubCategory
);

/**
 * Update category
 */
router.patch(
  '/:id',
  ...requireAdmin,
  validate(['id'], 'params'),
  validate(['name']),
  controller.updateCategory
);

/**
 * Delete category
 */
router.delete(
  '/:id',
  ...requireAdmin,
  validate(['id'], 'params'),
  controller.deleteCategory
);

module.exports = router;
