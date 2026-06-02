const service = require('../services/category.service');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * POST /api/admin/categories
 */
const createCategory = asyncHandler(async (req, res) => {
  const result = await service.createCategory(req.body.name);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

/**
 * POST /api/admin/categories/subcategories
 */
const createSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, name } = req.body;

  const result = await service.createSubCategory(
    Number(categoryId),
    name
  );

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  createCategory,
  createSubCategory,
};