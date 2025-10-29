import { z } from 'zod';

/**
 * Registration form validation schema
 * Matches backend requirements exactly
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login form validation schema
 * Basic validation (no backend API call)
 */
export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

