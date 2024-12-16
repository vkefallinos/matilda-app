import { FormSchema } from './types'

export const classroomSchema: FormSchema = {
  schema: {
    type: 'object',
    required: ['name', 'grade_level', 'subject', 'academic_year'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        readOnly: true,
      },
      name: {
        type: 'string',
        title: 'Classroom Name',
        minLength: 3,
      },
      grade_level: {
        type: 'string',
        title: 'Grade Level',
        enum: [
          'Kindergarten',
          '1st Grade',
          '2nd Grade',
          '3rd Grade',
          '4th Grade',
          '5th Grade',
          '6th Grade',
          'Middle School',
          'High School',
        ],
      },
      subject: {
        type: 'string',
        title: 'Primary Subject',
        enum: [
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
        ],
      },
      academic_year: {
        type: 'string',
        title: 'Academic Year',
        minLength: 1,
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      teacher_id: {
        type: 'string',
        format: 'uuid',
        readOnly: true,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
    },
  },
  uiSchema: {
    id: {
      'ui:widget': 'hidden',
    },
    teacher_id: {
      'ui:widget': 'hidden',
    },
    created_at: {
      'ui:widget': 'hidden',
    },
    updated_at: {
      'ui:widget': 'hidden',
    },
    description: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
  },
}
