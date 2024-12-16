import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { getClassroom } from '../../../lib/classroom-service'
import { getLessonPlansByClassroom } from '../../../lib/lesson-plan-service'
import type { Classroom, LessonPlan } from '../../../types/database'

export default function ClassroomView() {
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
      setError('Failed to load classroom data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!classroom) {
    return <div>Classroom not found</div>
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <p className="text-gray-600">
              {classroom.grade_level} - {classroom.subject}
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href={`/classrooms/${id}/students/new`}
              className="btn-secondary"
            >
              Add Student
            </Link>
            <Link
              href={`/classrooms/${id}/lesson-plans/new`}
              className="btn-primary"
            >
              Create Lesson Plan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Students</h2>
              <Link
                href={`/classrooms/${id}/students`}
                className="text-blue-500 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
            {/* Student count and quick stats */}
            <div className="text-gray-600">
              {classroom.students?.length || 0} students enrolled
            </div>
          </div>

          {/* Lesson Plans Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lesson Plans</h2>
              <Link
                href={`classrooms/${id}/lesson-plans`}
                className="text-blue-500 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
            
            {lessonPlans.length > 0 ? (
              <div className="space-y-4">
                {lessonPlans.slice(0, 3).map((plan) => (
                  <div
                    key={plan.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <Link
                      href={`classrooms/${id}/lesson-plans/${plan.id}`}
                      className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded"
                    >
                      <h3 className="font-medium">{plan.title}</h3>
                      <p className="text-sm text-gray-600">
                        Duration: {plan.duration} minutes
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No lesson plans yet</p>
            )}
          </div>
        </div>

        {/* Classroom Details */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Classroom Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Grade Level</h3>
              <p>{classroom.grade_level}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Subject</h3>
              <p>{classroom.subject}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Academic Year</h3>
              <p>{classroom.academic_year}</p>
            </div>
            {classroom.description && (
              <div className="col-span-2">
                <h3 className="font-medium text-gray-700">Description</h3>
                <p>{classroom.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
