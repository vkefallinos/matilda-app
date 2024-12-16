import { z } from 'zod'
import { errorLogger } from './error-logger'

export class ValidationError extends Error {
  constructor(message: string, public errors: z.ZodError) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function createValidator<T extends z.ZodType>(schema: T) {
  return {
    validate: (data: unknown): z.infer<T> => {
      try {
        return schema.parse(data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          errorLogger.logError(error, {
            level: 'warning',
            context: { data, errors: error.errors },
          })
          throw new ValidationError('Validation failed', error)
        }
        throw error
      }
    },
    validateAsync: async (data: unknown): Promise<z.infer<T>> => {
      try {
        return await schema.parseAsync(data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          errorLogger.logError(error, {
            level: 'warning',
            context: { data, errors: error.errors },
          })
          throw new ValidationError('Validation failed', error)
        }
        throw error
      }
    },
    isValid: (data: unknown): boolean => {
      return schema.safeParse(data).success
    },
  }
}

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be less than 72 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  avatar_url: z.string().url().nullable(),
})

export const classroomSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  grade_level: z.string().min(1, 'Grade level is required'),
  subject: z.string().min(1, 'Subject is required'),
  academic_year: z.string().min(1, 'Academic year is required'),
})

export const studentSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  date_of_birth: z.string().optional(),
  special_needs: z.string().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  classroom_id: z.string().uuid('Invalid classroom ID'),
})

export const lessonPlanSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  subject: z.string().min(1, 'Subject is required'),
  grade_level: z.string().min(1, 'Grade level is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  materials: z.array(z.string()).optional(),
  procedure: z.string().min(1, 'Procedure is required'),
  assessment: z.string().optional(),
  homework: z.string().optional(),
  notes: z.string().optional(),
  classroom_id: z.string().uuid('Invalid classroom ID'),
})
