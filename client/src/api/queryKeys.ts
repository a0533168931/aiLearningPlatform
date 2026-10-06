export const queryKeys = {
  categories: ['categories'] as const,
  subcategories: (categoryId: number | null | undefined) =>
    ['subcategories', categoryId] as const,
  promptHistory: (userId: number | null | undefined) =>
    ['promptHistory', userId] as const,
  prompt: (promptId: number) => ['prompt', promptId] as const,
  categoryPrompts: (categoryId: number) =>
    ['categoryPrompts', categoryId] as const,
  users: ['users'] as const,
};

export function isPositiveId(id: number | null | undefined): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}
