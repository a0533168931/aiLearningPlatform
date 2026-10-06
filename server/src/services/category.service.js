const prisma = require('../db/client');
const httpError = require('../utils/httpError');

const throwIfPrismaConstraint = (err, duplicateMessage) => {
  if (err.statusCode) throw err;

  if (err.code === 'P2002') {
    throw httpError(409, duplicateMessage);
  }

  if (err.code === 'P2025') {
    throw httpError(404, 'Record not found');
  }

  if (err.code === 'P2003') {
    throw httpError(
      409,
      'Cannot delete this record because related prompts still exist'
    );
  }

  throw err;
};

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
  const trimmedName = name.trim();

  const exists = await prisma.category.findUnique({
    where: { name: trimmedName },
  });

  if (exists) {
    throw httpError(409, 'Category already exists');
  }

  return prisma.category.create({
    data: { name: trimmedName },
  });
};

/**
 * Update category
 */
const updateCategory = async (id, name) => {
  const trimmedName = name.trim();

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw httpError(404, 'Category not found');
  }

  const duplicate = await prisma.category.findFirst({
    where: {
      name: trimmedName,
      NOT: { id },
    },
  });

  if (duplicate) {
    throw httpError(409, 'Category already exists');
  }

  try {
    return await prisma.category.update({
      where: { id },
      data: { name: trimmedName },
    });
  } catch (err) {
    throwIfPrismaConstraint(err, 'Category already exists');
  }
};

/**
 * Delete category.
 * Existing Prisma relations are preserved:
 * - SubCategory rows cascade on category delete
 * - Prompt.categoryId is ON DELETE RESTRICT, so delete fails if prompts exist
 */
const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw httpError(404, 'Category not found');
  }

  try {
    await prisma.category.delete({ where: { id } });
    return { id };
  } catch (err) {
    throwIfPrismaConstraint(
      err,
      'Cannot delete this category because related records exist'
    );
  }
};

/**
 * Create subcategory
 */
const createSubCategory = async (categoryId, name) => {
  const trimmedName = name.trim();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw httpError(404, 'Category not found');
  }

  const duplicate = await prisma.subCategory.findUnique({
    where: {
      name_categoryId: {
        name: trimmedName,
        categoryId,
      },
    },
  });

  if (duplicate) {
    throw httpError(409, 'Subcategory already exists in this category');
  }

  try {
    return await prisma.subCategory.create({
      data: { name: trimmedName, categoryId },
    });
  } catch (err) {
    throwIfPrismaConstraint(err, 'Subcategory already exists in this category');
  }
};

/**
 * Update subcategory name within its existing category
 */
const updateSubCategory = async (id, name) => {
  const trimmedName = name.trim();

  const subCategory = await prisma.subCategory.findUnique({
    where: { id },
  });

  if (!subCategory) {
    throw httpError(404, 'Subcategory not found');
  }

  const duplicate = await prisma.subCategory.findFirst({
    where: {
      name: trimmedName,
      categoryId: subCategory.categoryId,
      NOT: { id },
    },
  });

  if (duplicate) {
    throw httpError(409, 'Subcategory already exists in this category');
  }

  try {
    return await prisma.subCategory.update({
      where: { id },
      data: { name: trimmedName },
    });
  } catch (err) {
    throwIfPrismaConstraint(err, 'Subcategory already exists in this category');
  }
};

/**
 * Delete subcategory.
 * Prompt.subCategoryId is ON DELETE RESTRICT, so delete fails if prompts exist.
 */
const deleteSubCategory = async (id) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id },
  });

  if (!subCategory) {
    throw httpError(404, 'Subcategory not found');
  }

  try {
    await prisma.subCategory.delete({ where: { id } });
    return { id };
  } catch (err) {
    throwIfPrismaConstraint(
      err,
      'Cannot delete this subcategory because related prompts still exist'
    );
  }
};

module.exports = {
  getAllCategories,
  getSubCategoriesByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
