import { z } from 'zod'

export const gradeLevels = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  'Middle School',
  'High School',
] as const

export const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
  'Foreign Language',
  'Other',
] as const

// Base schema that matches both Supabase database and JSON schema
export const classroomSchema = z.object({
  id: z.string().uuid().optional(), // UUID in database, optional for creation
  name: z.string().min(3),
  description: z.string().optional(),
  grade_level: z.enum(gradeLevels),
  subject: z.enum(subjects),
  academic_year: z.string().min(1),
  teacher_id: z.string().uuid().optional(), // Set by the API
  created_at: z.string().datetime().optional(), // Set by database
  updated_at: z.string().datetime().optional(), // Set by database
})

// Schema for creating a new classroom (matches the required fields in JSON schema)
export const createClassroomSchema = classroomSchema
  .omit({
    id: true,
    teacher_id: true,
    created_at: true,
    updated_at: true,
  })
  .required({
    name: true,
    grade_level: true,
    subject: true,
    academic_year: true,
  })

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>

// Schema for updating an existing classroom
export const updateClassroomSchema = createClassroomSchema.partial()

export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>

// Schema for the complete classroom type from database
export type Classroom = z.infer<typeof classroomSchema>
