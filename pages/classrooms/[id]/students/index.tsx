import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import StudentCard from '../../../../components/StudentCard'
import { getStudentsByClassroom, deleteStudent } from '../../../../lib/student-service'
import { getClassroom } from '../../../../lib/classroom-service'
import type { Student, Classroom } from '../../../../types/database'

export default function ClassroomStudents() {
  const router = useRouter()
  const { id } = router.query
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    try {
      const [classroomData, studentsData] = await Promise.all([
        getClassroom(id as string),
        getStudentsByClassroom(id as string),
      ])
      setClassroom(classroomData)
      setStudents(studentsData)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to remove this student?')) {
      return
    }

    try {
      await deleteStudent(studentId)
      setStudents(students.filter(s => s.id !== studentId))
    } catch (err) {
      setError('Failed to delete student')
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
              {classroom.name} - Students
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
              href={`/classrooms/${classroom.id}/students/new`}
              className="btn-primary"
            >
              Add Student
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {students.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No students yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first student
            </p>
            <Link
              href={`/classrooms/${classroom.id}/students/new`}
              className="btn-primary"
            >
              Add Student
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
