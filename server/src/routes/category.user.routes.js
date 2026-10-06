const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.user.controller');

/**
 * Get all categories
 */
router.get('/', controller.getAllCategories);

/**
 * Get subcategories by category
 */
router.get('/:id/subcategories', controller.getSubCategoriesByCategory);

module.exports = router;