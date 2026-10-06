const service = require('../services/category.service');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * GET /api/categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const data = await service.getAllCategories();

  res.status(200).json({
    status: 'success',
    data,
  });
});

/**
 * GET /api/categories/:id/subcategories
 */
const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const data = await service.getSubCategoriesByCategory(
    Number(req.params.id)
  );

  res.status(200).json({
    status: 'success',
    data,
  });
});

module.exports = {
  getAllCategories,
  getSubCategoriesByCategory,
};