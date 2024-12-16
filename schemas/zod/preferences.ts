import { z } from 'zod';

// Base schema for teacher preferences
export const teacherPreferencesSchema = z.object({
  teacher_id: z.string().uuid('Invalid teacher ID'),
  preferences: z.record(z.unknown()).default({}),
});

// Schema for creating new preferences
export const createTeacherPreferencesSchema = teacherPreferencesSchema.omit({ 
  created_at: true,
  updated_at: true,
});

// Schema for updating existing preferences
export const updateTeacherPreferencesSchema = createTeacherPreferencesSchema.partial();

// Schema for preferences with database fields
export const dbTeacherPreferencesSchema = teacherPreferencesSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Base schema for classroom settings
export const classroomSettingsSchema = z.object({
  classroom_id: z.string().uuid('Invalid classroom ID'),
  settings: z.record(z.unknown()).default({}),
});

// Schema for creating new settings
export const createClassroomSettingsSchema = classroomSettingsSchema.omit({ 
  created_at: true,
  updated_at: true,
});

// Schema for updating existing settings
export const updateClassroomSettingsSchema = createClassroomSettingsSchema.partial();

// Schema for settings with database fields
export const dbClassroomSettingsSchema = classroomSettingsSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Types
export type TeacherPreferences = z.infer<typeof teacherPreferencesSchema>;
export type CreateTeacherPreferences = z.infer<typeof createTeacherPreferencesSchema>;
export type UpdateTeacherPreferences = z.infer<typeof updateTeacherPreferencesSchema>;
export type DbTeacherPreferences = z.infer<typeof dbTeacherPreferencesSchema>;

export type ClassroomSettings = z.infer<typeof classroomSettingsSchema>;
export type CreateClassroomSettings = z.infer<typeof createClassroomSettingsSchema>;
export type UpdateClassroomSettings = z.infer<typeof updateClassroomSettingsSchema>;
export type DbClassroomSettings = z.infer<typeof dbClassroomSettingsSchema>;
