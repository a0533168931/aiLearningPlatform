const prisma = require('../db/client');

/**
 * Get all categories
 */
const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get subcategories by category id
 */
const getSubCategoriesByCategory = async (categoryId) => {
  return prisma.subCategory.findMany({
    where: { categoryId },
    orderBy: { id: 'asc' },
  });
};

/**
 * Create category
 */
const createCategory = async (name) => {
  const exists = await prisma.category.findUnique({
    where: { name },
  });

  if (exists) {
    const error = new Error('Category already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: { name },
  });
};

/**
 * Create subcategory
 */
const createSubCategory = async (categoryId, name) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.subCategory.create({
    data: { name, categoryId },
  });
};

module.exports = {
  getAllCategories,
  getSubCategoriesByCategory,
  createCategory,
  createSubCategory,
};