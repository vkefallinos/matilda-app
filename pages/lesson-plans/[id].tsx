import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import SchemaForm from '../../components/SchemaForm'
import { getLessonPlan, updateLessonPlan, deleteLessonPlan } from '../../lib/lesson-plan-service'
import type { LessonPlan } from '../../types/database'

const lessonPlanSchema = {
  type: 'object',
  required: ['title', 'subject', 'grade_level', 'duration', 'objectives', 'procedure'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    subject: {
      type: 'string',
      title: 'Subject',
    },
    grade_level: {
      type: 'string',
      title: 'Grade Level',
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
      title: 'Procedure',
    },
    assessment: {
      type: 'string',
      title: 'Assessment',
    },
    homework: {
      type: 'string',
      title: 'Homework',
    },
    notes: {
      type: 'string',
      title: 'Notes',
    },
  },
}

const uiSchema = {
  objectives: {
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
    'ui:widget': 'textarea',
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
}

export default function LessonPlanDetail() {
  const router = useRouter()
  const { id } = router.query
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadLessonPlan()
    }
  }, [id])

  const loadLessonPlan = async () => {
    try {
      const data = await getLessonPlan(id as string)
      setLessonPlan(data)
    } catch (err) {
      setError('Failed to load lesson plan')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async ({ formData }: { formData: any }) => {
    try {
      const updatedLessonPlan = await updateLessonPlan(id as string, formData)
      setLessonPlan(updatedLessonPlan)
      router.push(`/classrooms/${lessonPlan?.classroom_id}/lesson-plans`)
    } catch (err) {
      setError('Failed to update lesson plan')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lesson plan?')) {
      return
    }

    try {
      await deleteLessonPlan(id as string)
      router.push(`/classrooms/${lessonPlan?.classroom_id}/lesson-plans`)
    } catch (err) {
      setError('Failed to delete lesson plan')
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

  if (!lessonPlan) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Lesson plan not found
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
              Edit Lesson Plan
            </h1>
            <p className="text-gray-600">
              {lessonPlan.title}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/classrooms/${lessonPlan.classroom_id}/lesson-plans`}
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              className="btn-error"
            >
              Delete
            </button>
          </div>
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
            formData={lessonPlan}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  )
}
