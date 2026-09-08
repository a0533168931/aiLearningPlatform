import { z } from 'zod';

export const createPromptSchema = z.object({
  categoryId: z
    .number()
    .int('categoryId must be a positive integer')
    .positive('categoryId must be a positive integer'),
  subCategoryId: z
    .number()
    .int('Please select a subcategory')
    .positive('Please select a subcategory'),
  prompt: z
    .string()
    .trim()
    .min(3, 'Prompt must be at least 3 characters'),
});

export type CreatePromptFormValues = z.infer<typeof createPromptSchema>;
