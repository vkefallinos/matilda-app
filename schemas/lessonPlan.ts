import { FormSchema } from './types'

export const lessonPlanSchema: FormSchema = {
  schema: {
    type: 'object',
    required: ['title', 'subject', 'gradeLevel', 'duration', 'objectives'],
    properties: {
      title: {
        type: 'string',
        title: 'Lesson Title',
        minLength: 3,
      },
      subject: {
        type: 'string',
        title: 'Subject',
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
      gradeLevel: {
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
      duration: {
        type: 'integer',
        title: 'Duration (minutes)',
        minimum: 15,
        maximum: 180,
      },
      objectives: {
        type: 'array',
        title: 'Learning Objectives',
        minItems: 1,
        items: {
          type: 'string',
        },
      },
      standards: {
        type: 'array',
        title: 'Academic Standards',
        items: {
          type: 'string',
        },
      },
      materials: {
        type: 'array',
        title: 'Materials Needed',
        items: {
          type: 'string',
        },
      },
      procedure: {
        type: 'object',
        title: 'Lesson Procedure',
        required: ['introduction', 'mainActivity', 'closure'],
        properties: {
          introduction: {
            type: 'string',
            title: 'Introduction/Hook',
          },
          mainActivity: {
            type: 'string',
            title: 'Main Activity',
          },
          closure: {
            type: 'string',
            title: 'Closure',
          },
        },
      },
      differentiation: {
        type: 'object',
        title: 'Differentiation Strategies',
        properties: {
          forStruggling: {
            type: 'string',
            title: 'For Struggling Students',
          },
          forAdvanced: {
            type: 'string',
            title: 'For Advanced Students',
          },
          forELL: {
            type: 'string',
            title: 'For English Language Learners',
          },
        },
      },
      assessment: {
        type: 'object',
        title: 'Assessment',
        properties: {
          formative: {
            type: 'string',
            title: 'Formative Assessment',
          },
          summative: {
            type: 'string',
            title: 'Summative Assessment',
          },
        },
      },
      homework: {
        type: 'string',
        title: 'Homework Assignment',
      },
      reflection: {
        type: 'object',
        title: 'Teacher Reflection',
        properties: {
          strengths: {
            type: 'string',
            title: 'Lesson Strengths',
          },
          improvements: {
            type: 'string',
            title: 'Areas for Improvement',
          },
          notes: {
            type: 'string',
            title: 'Additional Notes',
          },
        },
      },
    },
  },
  uiSchema: {
    objectives: {
      'ui:options': {
        orderable: true,
        addable: true,
        removable: true,
      },
    },
    standards: {
      'ui:options': {
        orderable: true,
        addable: true,
        removable: true,
      },
    },
    materials: {
      'ui:options': {
        orderable: true,
        addable: true,
        removable: true,
      },
    },
    procedure: {
      introduction: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      mainActivity: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
      closure: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
    },
    differentiation: {
      forStruggling: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      forAdvanced: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      forELL: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
    },
    assessment: {
      formative: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      summative: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
    },
    homework: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
    reflection: {
      strengths: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      improvements: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      notes: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
    },
  },
}
