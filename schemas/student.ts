import { FormSchema } from './types'

export const studentSchema: FormSchema = {
  schema: {
    type: 'object',
    required: ['firstName', 'lastName', 'dateOfBirth'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name',
        minLength: 2,
      },
      lastName: {
        type: 'string',
        title: 'Last Name',
        minLength: 2,
      },
      dateOfBirth: {
        type: 'string',
        title: 'Date of Birth',
        format: 'date',
      },
      academicInformation: {
        type: 'object',
        title: 'Academic Information',
        properties: {
          previousSchool: {
            type: 'string',
            title: 'Previous School',
          },
          academicStrengths: {
            type: 'array',
            title: 'Academic Strengths',
            items: {
              type: 'string',
            },
          },
          areasForImprovement: {
            type: 'array',
            title: 'Areas for Improvement',
            items: {
              type: 'string',
            },
          },
        },
      },
      specialNeeds: {
        type: 'object',
        title: 'Special Needs',
        properties: {
          hasIEP: {
            type: 'boolean',
            title: 'Has IEP',
          },
          accommodations: {
            type: 'string',
            title: 'Accommodations',
          },
          specialServices: {
            type: 'array',
            title: 'Special Services',
            items: {
              type: 'string',
              enum: [
                'Speech Therapy',
                'Occupational Therapy',
                'Physical Therapy',
                'Counseling',
                'Resource Room',
                'ESL Services',
              ],
            },
            uniqueItems: true,
          },
        },
      },
      healthInformation: {
        type: 'object',
        title: 'Health Information',
        properties: {
          allergies: {
            type: 'array',
            title: 'Allergies',
            items: {
              type: 'string',
            },
          },
          medications: {
            type: 'array',
            title: 'Medications',
            items: {
              type: 'string',
            },
          },
          emergencyContact: {
            type: 'object',
            title: 'Emergency Contact',
            properties: {
              name: {
                type: 'string',
                title: 'Name',
              },
              relationship: {
                type: 'string',
                title: 'Relationship',
              },
              phone: {
                type: 'string',
                title: 'Phone',
              },
            },
          },
        },
      },
      notes: {
        type: 'string',
        title: 'Additional Notes',
      },
    },
  },
  uiSchema: {
    dateOfBirth: {
      'ui:widget': 'date',
    },
    academicInformation: {
      academicStrengths: {
        'ui:options': {
          orderable: true,
          addable: true,
          removable: true,
        },
      },
      areasForImprovement: {
        'ui:options': {
          orderable: true,
          addable: true,
          removable: true,
        },
      },
    },
    specialNeeds: {
      accommodations: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      specialServices: {
        'ui:widget': 'checkboxes',
      },
    },
    healthInformation: {
      allergies: {
        'ui:options': {
          orderable: true,
          addable: true,
          removable: true,
        },
      },
      medications: {
        'ui:options': {
          orderable: true,
          addable: true,
          removable: true,
        },
      },
    },
    notes: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
  },
}
