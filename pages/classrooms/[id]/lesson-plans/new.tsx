import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import SchemaForm from '../../../../components/SchemaForm'
import { getClassroom } from '../../../../lib/classroom-service'
import { createLessonPlan } from '../../../../lib/lesson-plan-service'
import type { Classroom } from '../../../../types/database'
import { gradeLevels, subjects } from '../../../../schemas/zod/classroom'

const lessonPlanSchema = {
  type: 'object',
  required: ['title', 'subject', 'grade_level', 'duration', 'objectives', 'procedure'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
      minLength: 3,
    },
    subject: {
      type: 'string',
      title: 'Subject',
      enum: subjects,
    },
    grade_level: {
      type: 'string',
      title: 'Grade Level',
      enum: gradeLevels,
    },
    duration: {
      type: 'integer',
      title: 'Duration (minutes)',
      minimum: 1,
    },
    objectives: {
      type: 'array',
      title: 'Learning Objectives',
      items: {
        type: 'string',
      },
      minItems: 1,
    },
    materials: {
      type: 'array',
      title: 'Materials Needed',
      items: {
        type: 'string',
      },
    },
    procedure: {
      type: 'string',
      title: 'Lesson Procedure',
      minLength: 10,
    },
    assessment: {
      type: 'string',
      title: 'Assessment Method',
    },
    homework: {
      type: 'string',
      title: 'Homework Assignment',
    },
    notes: {
      type: 'string',
      title: 'Additional Notes',
    },
  },
}

const uiSchema = {
  'ui:order': [
    'title',
    'subject',
    'grade_level',
    'duration',
    'objectives',
    'materials',
    'procedure',
    'assessment',
    'homework',
    'notes',
  ],
  procedure: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
    },
  },
  assessment: {
    'ui:widget': 'textarea',
  },
  homework: {
    'ui:widget': 'textarea',
  },
  notes: {
    'ui:widget': 'textarea',
  },
  objectives: {
    'ui:options': {
      addable: true,
      orderable: true,
      removable: true,
    },
  },
  materials: {
    'ui:options': {
      addable: true,
      orderable: true,
      removable: true,
    },
  },
}

export default function NewLessonPlan() {
  const router = useRouter()
  const { id } = router.query
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showResourceOptions, setShowResourceOptions] = useState(false)
  const [createdLessonPlanId, setCreatedLessonPlanId] = useState('')

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
      const lessonPlan = await createLessonPlan(formData, id as string)
      
      setShowResourceOptions(true)
      setCreatedLessonPlanId(lessonPlan.id)
      
      router.push(`/classrooms/${id}/lesson-plans/${lessonPlan.id}`)
    } catch (err) {
      setError('Failed to create lesson plan')
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
              Create Lesson Plan
            </h1>
            <p className="text-gray-600">
              {classroom.name} • {classroom.grade_level}
            </p>
          </div>
          <Link
            href={`/classrooms/${classroom.id}/lesson-plans`}
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
            schema={lessonPlanSchema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onError={(errors) => console.error(errors)}
            submitText="Create Lesson Plan"
          />
        </div>

        {showResourceOptions && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create Additional Resources</h2>
            <div className="flex space-x-4">
              <Link
                href={`/classrooms/${id}/lesson-plans/${createdLessonPlanId}/quizzes/new`}
                className="btn-primary"
              >
                Create Quiz
              </Link>
              <Link
                href={`/classrooms/${id}/lesson-plans/${createdLessonPlanId}/worksheets/new`}
                className="btn-primary"
              >
                Create Worksheet
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
