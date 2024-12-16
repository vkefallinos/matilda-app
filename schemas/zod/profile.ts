import { z } from 'zod';

// Base schema for profile data
export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  avatar_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Schema for creating a new profile
export const createProfileSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  avatar_url: z.string().url().optional(),
});

// Schema for updating an existing profile
export const updateProfileSchema = createProfileSchema.partial();

// Schema for profile with database fields
export const dbProfileSchema = profileSchema.extend({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Types
export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type DbProfile = z.infer<typeof dbProfileSchema>;
