import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1, 'Question is required'),
  type: z.enum(['multiple_choice', 'short_answer', 'true_false']),
  options: z.array(z.string()).optional(),
  correct_answer: z.string(),
  points: z.number().int().positive(),
});

export const quizSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  lesson_plan_id: z.string().uuid('Invalid lesson plan ID'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  total_points: z.number().int().positive(),
  duration_minutes: z.number().int().positive(),
  assigned_student_ids: z.array(z.string().uuid()).optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createQuizSchema = quizSchema.omit({ 
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateQuizSchema = createQuizSchema.partial();

export type Question = z.infer<typeof questionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type CreateQuiz = z.infer<typeof createQuizSchema>;
export type UpdateQuiz = z.infer<typeof updateQuizSchema>;
