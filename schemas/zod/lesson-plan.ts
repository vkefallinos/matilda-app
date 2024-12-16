import { z } from 'zod';
import { gradeLevels, subjects } from './classroom';

// Base schema for lesson plan data
export const lessonPlanSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.enum(subjects),
  grade_level: z.enum(gradeLevels),
  duration: z.number().int().positive('Duration must be a positive number'),
  objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  materials: z.array(z.string()).optional(),
  procedure: z.string().min(10, 'Procedure must be at least 10 characters'),
  assessment: z.string().optional(),
  homework: z.string().optional(),
  notes: z.string().optional(),
  classroom_id: z.string().uuid('Invalid classroom ID'),
  teacher_id: z.string().uuid('Invalid teacher ID'),
});

// Schema for creating a new lesson plan
export const createLessonPlanSchema = lessonPlanSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating an existing lesson plan
export const updateLessonPlanSchema = createLessonPlanSchema.partial();

// Schema for lesson plan with database fields
export const dbLessonPlanSchema = lessonPlanSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Types
export type LessonPlan = z.infer<typeof lessonPlanSchema>;
export type CreateLessonPlan = z.infer<typeof createLessonPlanSchema>;
export type UpdateLessonPlan = z.infer<typeof updateLessonPlanSchema>;
export type DbLessonPlan = z.infer<typeof dbLessonPlanSchema>;
