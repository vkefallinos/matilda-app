import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Layout from '@/components/Layout'
import { createQuiz } from '@/lib/quiz-service'
import { getLessonPlan } from '@/lib/lesson-plan-service'
import { getStudentsByClassroom } from '@/lib/student-service'
import type { LessonPlan } from '@/types/database'
import type { Student } from '@/types/database'
import dynamic from 'next/dynamic'

const Form = dynamic(() => import('@/components/SchemaForm'), { ssr: false })

export default function NewQuiz() {
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
      await createQuiz({
        ...formData,
        lesson_plan_id: lessonPlanId as string,
        total_points: formData.questions.reduce((sum: number, q: any) => sum + q.points, 0)
      })
      toast.success('Quiz created successfully')
      router.push(`/classrooms/${classroomId}/lesson-plans/${lessonPlanId}`)
    } catch (error) {
      console.error('Error creating quiz:', error)
      toast.error('Failed to create quiz')
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
    required: ['title', 'questions', 'duration_minutes', 'due_date'],
    properties: {
      title: {
        type: 'string',
        title: 'Quiz Title',
        minLength: 3
      },
      description: {
        type: 'string',
        title: 'Description',
      },
      questions: {
        type: 'array',
        title: 'Questions',
        minItems: 1,
        items: {
          type: 'object',
          required: ['question', 'type', 'correct_answer', 'points'],
          properties: {
            question: {
              type: 'string',
              title: 'Question'
            },
            type: {
              type: 'string',
              title: 'Question Type',
              enum: ['multiple_choice', 'short_answer', 'true_false'],
              enumNames: ['Multiple Choice', 'Short Answer', 'True/False']
            },
            options: {
              type: 'array',
              title: 'Options',
              items: {
                type: 'string'
              }
            },
            correct_answer: {
              type: 'string',
              title: 'Correct Answer'
            },
            points: {
              type: 'integer',
              title: 'Points',
              minimum: 1
            }
          }
        }
      },
      duration_minutes: {
        type: 'integer',
        title: 'Duration (minutes)',
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
    questions: {
      items: {
        type: {
          'ui:widget': 'select'
        },
        options: {
          'ui:options': {
            orderable: true,
            addable: true,
            removable: true
          }
        },
        correct_answer: {
          'ui:widget': 'textarea'
        }
      }
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
          Create Quiz for {lessonPlan.title}
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
