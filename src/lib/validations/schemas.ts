import { z } from 'zod';

// User Profile Schemas
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'El nombre es requerido').max(100).nullable(),
  email: z.string().email('Email inválido').nullable(),
  company: z.string().max(100).nullable(),
  avatar_url: z.string().url().nullable(),
  subscription_tier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  subscription_status: z
    .enum(['active', 'inactive', 'canceled', 'past_due'])
    .default('inactive'),
  stripe_customer_id: z.string().nullable(),
  mercadopago_customer_id: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Partial schemas para updates
export const updateUserProfileSchema = userProfileSchema
  .partial()
  .omit({ id: true, created_at: true, updated_at: true });

// Project Schemas
export const projectSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(1000).nullable(),
  status: z.enum(['active', 'archived', 'deleted']).default('active'),
  metadata: z.record(z.any()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = projectSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const updateProjectSchema = createProjectSchema.partial();

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  });
