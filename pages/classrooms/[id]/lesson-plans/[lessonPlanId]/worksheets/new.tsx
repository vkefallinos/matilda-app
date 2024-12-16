import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Layout from '@/components/Layout'
import { createWorksheet } from '@/lib/worksheet-service'
import { getLessonPlan } from '@/lib/lesson-plan-service'
import { getStudentsByClassroom } from '@/lib/student-service'
import type { LessonPlan } from '@/types/database'
import type { Student } from '@/types/database'
import dynamic from 'next/dynamic'

const Form = dynamic(() => import('@/components/SchemaForm'), { ssr: false })

export default function NewWorksheet() {
  const router = useRouter()
  const { id: classroomId, lessonPlanId } = router.query
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (classroomId && lessonPlanId) {
        try {
          const [lessonPlanData, studentsData] = await Promise.all([
            getLessonPlan(lessonPlanId as string),
            getStudentsByClassroom(classroomId as string)
          ])
          setLessonPlan(lessonPlanData)
          setStudents(studentsData)
        } catch (error) {
          console.error('Error loading data:', error)
          toast.error('Failed to load data')
        } finally {
          setLoading(false)
        }
      }
    }
    loadData()
  }, [classroomId, lessonPlanId])

  const handleSubmit = async (formData: any) => {
    try {
      await createWorksheet({
        ...formData,
        lesson_plan_id: lessonPlanId as string,
      })
      toast.success('Worksheet created successfully')
      router.push(`/classrooms/${classroomId}/lesson-plans/${lessonPlanId}`)
    } catch (error) {
      console.error('Error creating worksheet:', error)
      toast.error('Failed to create worksheet')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!lessonPlan) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div>Lesson plan not found</div>
        </div>
      </Layout>
    )
  }

  const schema = {
    type: 'object',
    required: ['title', 'items', 'difficulty_level', 'estimated_time_minutes'],
    properties: {
      title: {
        type: 'string',
        title: 'Worksheet Title',
        minLength: 3
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      items: {
        type: 'array',
        title: 'Items',
        minItems: 1,
        items: {
          type: 'object',
          required: ['type', 'content', 'instructions'],
          properties: {
            type: {
              type: 'string',
              title: 'Item Type',
              enum: ['exercise', 'problem', 'activity'],
              enumNames: ['Exercise', 'Problem', 'Activity']
            },
            content: {
              type: 'string',
              title: 'Content'
            },
            instructions: {
              type: 'string',
              title: 'Instructions'
            },
            points: {
              type: 'integer',
              title: 'Points',
              minimum: 1
            },
            resources: {
              type: 'array',
              title: 'Resources',
              items: {
                type: 'string'
              }
            }
          }
        }
      },
      difficulty_level: {
        type: 'string',
        title: 'Difficulty Level',
        enum: ['easy', 'medium', 'hard'],
        enumNames: ['Easy', 'Medium', 'Hard']
      },
      estimated_time_minutes: {
        type: 'integer',
        title: 'Estimated Time (minutes)',
        minimum: 1
      },
      assigned_student_ids: {
        type: 'array',
        title: 'Assign to Students',
        items: {
          type: 'string',
          enum: students.map(s => s.id),
          enumNames: students.map(s => `${s.first_name} ${s.last_name}`)
        },
        uniqueItems: true
      },
      due_date: {
        type: 'string',
        title: 'Due Date',
        format: 'date-time'
      }
    }
  }

  const uiSchema = {
    description: {
      'ui:widget': 'textarea'
    },
    items: {
      items: {
        type: {
          'ui:widget': 'select'
        },
        content: {
          'ui:widget': 'textarea'
        },
        instructions: {
          'ui:widget': 'textarea'
        },
        resources: {
          'ui:options': {
            orderable: true,
            addable: true,
            removable: true
          }
        }
      }
    },
    difficulty_level: {
      'ui:widget': 'select'
    },
    assigned_student_ids: {
      'ui:widget': 'checkboxes'
    },
    due_date: {
      'ui:widget': 'alt-datetime',
      'ui:options': {
        yearsRange: [2024, 2030]
      }
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Create Worksheet for {lessonPlan.title}
        </h1>

        <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={handleSubmit}
          className="space-y-6"
        />
      </div>
    </Layout>
  )
}
