export type Category = {
  id: number;
  name: string;
  createdAt: string;
};

export type SubCategory = {
  id: number;
  name: string;
  categoryId: number;
  createdAt: string;
};

export type CreateCategoryRequest = {
  name: string;
};

export type UpdateCategoryRequest = {
  name: string;
};

export type CreateSubCategoryRequest = {
  categoryId: number;
  name: string;
};

export type UpdateSubCategoryRequest = {
  name: string;
};
