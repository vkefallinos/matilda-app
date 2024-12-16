import { z } from 'zod';

export const worksheetItemSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['exercise', 'problem', 'activity']),
  content: z.string().min(1, 'Content is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  points: z.number().int().positive().optional(),
  resources: z.array(z.string()).optional(),
});

export const worksheetSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  lesson_plan_id: z.string().uuid('Invalid lesson plan ID'),
  items: z.array(worksheetItemSchema).min(1, 'At least one item is required'),
  difficulty_level: z.enum(['easy', 'medium', 'hard']),
  estimated_time_minutes: z.number().int().positive(),
  assigned_student_ids: z.array(z.string().uuid()).optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createWorksheetSchema = worksheetSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateWorksheetSchema = createWorksheetSchema.partial();

export type WorksheetItem = z.infer<typeof worksheetItemSchema>;
export type Worksheet = z.infer<typeof worksheetSchema>;
export type CreateWorksheet = z.infer<typeof createWorksheetSchema>;
export type UpdateWorksheet = z.infer<typeof updateWorksheetSchema>;
