import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[\p{L}\s]{2,100}$/u;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .toLowerCase()
    .regex(EMAIL_PATTERN, 'Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .regex(NAME_PATTERN, 'Name must contain letters only (min 2 characters)'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .toLowerCase()
      .regex(EMAIL_PATTERN, 'Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
