import { FormSchema } from './types'

export const teacherProfileSchema: FormSchema = {
  schema: {
    type: 'object',
    required: ['teachingPhilosophy', 'teachingExperience', 'gradeLevel', 'subjects'],
    properties: {
      teachingPhilosophy: {
        type: 'string',
        title: 'Teaching Philosophy',
        description: 'Describe your approach to teaching and education',
      },
      teachingExperience: {
        type: 'integer',
        title: 'Years of Teaching Experience',
        minimum: 0,
      },
      gradeLevel: {
        type: 'array',
        title: 'Grade Levels',
        items: {
          type: 'string',
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
        uniqueItems: true,
      },
      subjects: {
        type: 'array',
        title: 'Subjects',
        items: {
          type: 'string',
          enum: [
            'Mathematics',
            'Science',
            'English',
            'History',
            'Geography',
            'Art',
            'Music',
            'Physical Education',
            'Computer Science',
            'Foreign Language',
          ],
        },
        uniqueItems: true,
      },
      specializations: {
        type: 'array',
        title: 'Specializations',
        items: {
          type: 'string',
          enum: [
            'Special Education',
            'ESL/ELL',
            'Gifted Education',
            'Early Childhood',
            'STEM',
            'Arts Integration',
            'Technology Integration',
          ],
        },
        uniqueItems: true,
      },
      preferredTeachingMethods: {
        type: 'array',
        title: 'Preferred Teaching Methods',
        items: {
          type: 'string',
          enum: [
            'Direct Instruction',
            'Project-based Learning',
            'Inquiry-based Learning',
            'Cooperative Learning',
            'Differentiated Instruction',
            'Blended Learning',
            'Flipped Classroom',
          ],
        },
        uniqueItems: true,
      },
    },
  },
  uiSchema: {
    teachingPhilosophy: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
    },
    gradeLevel: {
      'ui:widget': 'checkboxes',
    },
    subjects: {
      'ui:widget': 'checkboxes',
    },
    specializations: {
      'ui:widget': 'checkboxes',
    },
    preferredTeachingMethods: {
      'ui:widget': 'checkboxes',
    },
  },
}
