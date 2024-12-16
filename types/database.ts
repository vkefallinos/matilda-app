export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Classroom {
  id: string
  name: string
  description?: string
  grade_level: string
  subject: string
  academic_year: string
  teacher_id: string
  created_at: string
  updated_at: string
  student_count?: number
}

export interface Student {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  special_needs?: string
  notes?: string
  classroom_id: string
  created_at: string
  updated_at: string
}

export interface LessonPlan {
  id: string
  title: string
  subject: string
  grade_level: string
  duration: number
  objectives: string[]
  materials?: string[]
  procedure: string
  assessment?: string
  homework?: string
  notes?: string
  classroom_id: string
  teacher_id: string
  created_at: string
  updated_at: string
}

export interface TeacherPreferences {
  id: string
  teacher_id: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ClassroomSettings {
  id: string
  classroom_id: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  lesson_plan_id: string
  total_points: number
  duration_minutes: number
  questions: {
    id: string
    question: string
    type: 'multiple_choice' | 'short_answer' | 'true_false'
    options?: string[]
    correct_answer: string
    points: number
  }[]
  assigned_student_ids?: string[]
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Worksheet {
  id: string
  title: string
  description?: string
  content: string
  lesson_plan_id: string
  assigned_student_ids?: string[]
  due_date?: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  estimated_time_minutes: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      classrooms: {
        Row: Classroom
        Insert: Omit<Classroom, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Classroom, 'id' | 'teacher_id' | 'created_at' | 'updated_at'>>
      }
      students: {
        Row: Student
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Student, 'id' | 'classroom_id' | 'created_at' | 'updated_at'>>
      }
      lesson_plans: {
        Row: LessonPlan
        Insert: Omit<LessonPlan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<LessonPlan, 'id' | 'teacher_id' | 'created_at' | 'updated_at'>>
      }
      teacher_preferences: {
        Row: TeacherPreferences
        Insert: Omit<TeacherPreferences, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TeacherPreferences, 'id' | 'teacher_id' | 'created_at' | 'updated_at'>>
      }
      classroom_settings: {
        Row: ClassroomSettings
        Insert: Omit<ClassroomSettings, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ClassroomSettings, 'id' | 'classroom_id' | 'created_at' | 'updated_at'>>
      }
      quizzes: {
        Row: Quiz
        Insert: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Quiz, 'id' | 'lesson_plan_id' | 'created_at' | 'updated_at'>>
      }
      worksheets: {
        Row: Worksheet
        Insert: Omit<Worksheet, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Worksheet, 'id' | 'lesson_plan_id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
