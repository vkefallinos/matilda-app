import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import LessonPlanCard from '../../../../components/LessonPlanCard'
import { getLessonPlansByClassroom, deleteLessonPlan } from '../../../../lib/lesson-plan-service'
import { getClassroom } from '../../../../lib/classroom-service'
import type { LessonPlan, Classroom } from '../../../../types/database'

export default function ClassroomLessonPlans() {
  const router = useRouter()
  const { id } = router.query
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    try {
      const [classroomData, lessonPlansData] = await Promise.all([
        getClassroom(id as string),
        getLessonPlansByClassroom(id as string),
      ])
      setClassroom(classroomData)
      setLessonPlans(lessonPlansData)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (lessonPlanId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson plan?')) {
      return
    }

    try {
      await deleteLessonPlan(lessonPlanId)
      setLessonPlans(lessonPlans.filter(lp => lp.id !== lessonPlanId))
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {classroom.name} - Lesson Plans
            </h1>
            <p className="text-gray-600">
              {classroom.grade_level} • {classroom.subject}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/classrooms/${classroom.id}`}
              className="btn-secondary"
            >
              Back to Classroom
            </Link>
            <Link
              href={`/classrooms/${classroom.id}/lesson-plans/new`}
              className="btn-primary"
            >
              Create Lesson Plan
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {lessonPlans.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lesson plans yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first lesson plan
            </p>
            <Link
              href={`/classrooms/${classroom.id}/lesson-plans/new`}
              className="btn-primary"
            >
              Create Lesson Plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessonPlans.map((lessonPlan) => (
              <LessonPlanCard
                key={lessonPlan.id}
                lessonPlan={lessonPlan}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
