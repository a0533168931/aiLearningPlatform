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
 * PATCH /api/admin/categories/:id
 */
const updateCategory = asyncHandler(async (req, res) => {
  const result = await service.updateCategory(Number(req.params.id), req.body.name);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

/**
 * DELETE /api/admin/categories/:id
 */
const deleteCategory = asyncHandler(async (req, res) => {
  await service.deleteCategory(Number(req.params.id));

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
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

/**
 * PATCH /api/admin/categories/subcategories/:id
 */
const updateSubCategory = asyncHandler(async (req, res) => {
  const result = await service.updateSubCategory(
    Number(req.params.id),
    req.body.name
  );

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

/**
 * DELETE /api/admin/categories/subcategories/:id
 */
const deleteSubCategory = asyncHandler(async (req, res) => {
  await service.deleteSubCategory(Number(req.params.id));

  res.status(200).json({
    status: 'success',
    message: 'Subcategory deleted successfully',
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
