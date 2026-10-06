import type { Category, SubCategory } from './category';

export type Prompt = {
  id: number;
  userId: number;
  categoryId: number;
  subCategoryId: number;
  prompt: string;
  response: string;
  createdAt: string;
};

export type PromptWithRelations = Prompt & {
  category: Category;
  subCategory: SubCategory;
};

export type CreatePromptRequest = {
  categoryId: number;
  subCategoryId: number;
  prompt: string;
};
