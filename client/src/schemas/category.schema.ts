import { z } from 'zod';

const NAME_PATTERN = /^[\p{L}\s]{2,100}$/u;

export const categoryNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .regex(NAME_PATTERN, 'Name must contain letters only (min 2 characters)'),
});

export type CategoryNameFormValues = z.infer<typeof categoryNameSchema>;
