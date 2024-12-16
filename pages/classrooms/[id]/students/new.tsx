import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import SchemaForm from '../../../../components/SchemaForm'
import { getClassroom } from '../../../../lib/classroom-service'
import { createStudent } from '../../../../lib/student-service'
import type { Classroom } from '../../../../types/database'

const studentSchema = {
  type: 'object',
  required: ['firstName', 'lastName'],
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
    specialNeeds: {
      type: 'object',
      title: 'Special Needs',
      properties: {
        hasIEP: {
          type: 'boolean',
          title: 'Has IEP',
          default: false,
        },
        accommodations: {
          type: 'string',
          title: 'Accommodations',
        },
        additionalNotes: {
          type: 'string',
          title: 'Additional Notes',
        },
      },
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
    notes: {
      type: 'string',
      title: 'Additional Notes',
    },
  },
}

const uiSchema = {
  'ui:order': ['firstName', 'lastName', 'dateOfBirth', 'specialNeeds', 'academicInformation', 'notes'],
  notes: {
    'ui:widget': 'textarea',
  },
  specialNeeds: {
    accommodations: {
      'ui:widget': 'textarea',
    },
    additionalNotes: {
      'ui:widget': 'textarea',
    },
  },
  academicInformation: {
    academicStrengths: {
      'ui:options': {
        addable: true,
        orderable: true,
        removable: true,
      },
    },
    areasForImprovement: {
      'ui:options': {
        addable: true,
        orderable: true,
        removable: true,
      },
    },
  },
}

export default function NewStudent() {
  const router = useRouter()
  const { id } = router.query
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadClassroom()
    }
  }, [id])

  const loadClassroom = async () => {
    try {
      const data = await getClassroom(id as string)
      setClassroom(data)
    } catch (err) {
      setError('Failed to load classroom')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      await createStudent(formData, id as string)
      router.push(`/classrooms/${id}/students`)
    } catch (err) {
      setError('Failed to create student')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!classroom) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Classroom not found
            </h3>
            <Link href="/classrooms" className="btn-primary">
              Back to Classrooms
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Student
            </h1>
            <p className="text-gray-600">
              {classroom.name} • {classroom.grade_level}
            </p>
          </div>
          <Link
            href={`/classrooms/${classroom.id}/students`}
            className="btn-secondary"
          >
            Cancel
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <SchemaForm
            schema={studentSchema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onError={(errors) => console.error(errors)}
            submitText="Add Student"
          />
        </div>
      </div>
    </Layout>
  )
}
