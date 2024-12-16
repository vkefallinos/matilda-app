import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import Layout from '@/components/Layout'
import { getLessonPlan } from '@/lib/lesson-plan-service'
import { getQuizzesByLessonPlan } from '@/lib/quiz-service'
import { getWorksheetsByLessonPlan } from '@/lib/worksheet-service'
import type { LessonPlan, Quiz, Worksheet } from '@/types/database'

export default function LessonPlanView() {
  const router = useRouter()
  const { id: classroomId, lessonPlanId } = router.query
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [worksheets, setWorksheets] = useState<Worksheet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (classroomId && lessonPlanId) {
        try {
          const [lessonPlanData, quizzesData, worksheetsData] = await Promise.all([
            getLessonPlan(lessonPlanId as string),
            getQuizzesByLessonPlan(lessonPlanId as string),
            getWorksheetsByLessonPlan(lessonPlanId as string)
          ])
          setLessonPlan(lessonPlanData)
          setQuizzes(quizzesData)
          setWorksheets(worksheetsData)
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{lessonPlan.title}</h1>
          <div className="flex space-x-4">
            <Link
              href={`/classrooms/${classroomId}/lesson-plans/${lessonPlanId}/quizzes/new`}
              className="btn-primary"
            >
              Create Quiz
            </Link>
            <Link
              href={`/classrooms/${classroomId}/lesson-plans/${lessonPlanId}/worksheets/new`}
              className="btn-primary"
            >
              Create Worksheet
            </Link>
          </div>
        </div>

        {/* Lesson Plan Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Lesson Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Subject</h3>
              <p>{lessonPlan.subject}</p>
            </div>
            <div>
              <h3 className="font-medium">Grade Level</h3>
              <p>{lessonPlan.grade_level}</p>
            </div>
            <div>
              <h3 className="font-medium">Duration</h3>
              <p>{lessonPlan.duration} minutes</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium">Objectives</h3>
            <ul className="list-disc list-inside">
              {lessonPlan.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="font-medium">Procedure</h3>
            <p className="whitespace-pre-wrap">{lessonPlan.procedure}</p>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Points:</span> {quiz.total_points}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Duration:</span>{' '}
                    {quiz.duration_minutes} minutes
                  </div>
                  {quiz.due_date && (
                    <div className="text-sm">
                      <span className="font-medium">Due:</span>{' '}
                      {new Date(quiz.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No quizzes created yet</p>
          )}
        </div>

        {/* Worksheets Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Worksheets</h2>
          {worksheets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worksheets.map((worksheet) => (
                <div
                  key={worksheet.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium">{worksheet.title}</h3>
                  <p className="text-sm text-gray-600">{worksheet.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Difficulty:</span>{' '}
                    {worksheet.difficulty_level}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Estimated Time:</span>{' '}
                    {worksheet.estimated_time_minutes} minutes
                  </div>
                  {worksheet.due_date && (
                    <div className="text-sm">
                      <span className="font-medium">Due:</span>{' '}
                      {new Date(worksheet.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No worksheets created yet</p>
          )}
        </div>
      </div>
    </Layout>
  )
}
