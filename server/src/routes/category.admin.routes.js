const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.admin.controller');
const validate = require('../middlewares/validate.middleware');

/**
 * Create category
 */
router.post('/', validate(['name']), controller.createCategory);

/**
 * Create subcategory
 */
router.post(
  '/subcategories',
  validate(['categoryId', 'name']),
  controller.createSubCategory
);

module.exports = router;