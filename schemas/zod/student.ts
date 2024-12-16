import { z } from 'zod';

// Form schema that matches the JSON schema form
export const studentFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().optional(), // ISO date string
  academicInformation: z.object({
    previousSchool: z.string().optional(),
    academicStrengths: z.array(z.string()).optional(),
    areasForImprovement: z.array(z.string()).optional(),
  }).optional(),
  specialNeeds: z.object({
    hasIEP: z.boolean().optional(),
    accommodations: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
});

// Base schema for student data in database
export const studentSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  date_of_birth: z.string().optional(),
  special_needs: z.string().optional(),
  notes: z.string().optional(),
  classroom_id: z.string().uuid('Invalid classroom ID'),
});

// Schema for creating a new student
export const createStudentSchema = studentSchema;

// Schema for updating an existing student
export const updateStudentSchema = studentSchema.partial();

// Schema for student with database fields
export const dbStudentSchema = studentSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Helper function to transform form data to database schema
export const transformFormToDb = (formData: z.infer<typeof studentFormSchema>, classroomId: string) => {
  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    date_of_birth: formData.dateOfBirth,
    special_needs: formData.specialNeeds ? 
      JSON.stringify({
        hasIEP: formData.specialNeeds.hasIEP,
        accommodations: formData.specialNeeds.accommodations,
        additionalNotes: formData.specialNeeds.additionalNotes,
      }) : undefined,
    notes: formData.notes || 
      (formData.academicInformation ? 
        JSON.stringify(formData.academicInformation) : undefined),
    classroom_id: classroomId,
  };
};

// Types
export type StudentForm = z.infer<typeof studentFormSchema>;
export type Student = z.infer<typeof studentSchema>;
export type CreateStudent = z.infer<typeof createStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type DbStudent = z.infer<typeof dbStudentSchema>;
