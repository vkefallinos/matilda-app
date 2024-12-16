import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import SchemaForm from '../../components/SchemaForm'
import { getStudent, updateStudent, deleteStudent } from '../../lib/student-service'
import type { Student } from '../../types/database'

const studentSchema = {
  type: 'object',
  required: ['first_name', 'last_name'],
  properties: {
    first_name: {
      type: 'string',
      title: 'First Name',
    },
    last_name: {
      type: 'string',
      title: 'Last Name',
    },
    date_of_birth: {
      type: 'string',
      title: 'Date of Birth',
      format: 'date',
    },
    special_needs: {
      type: 'boolean',
      title: 'Special Needs',
      default: false,
    },
    notes: {
      type: 'string',
      title: 'Notes',
    },
  },
}

const uiSchema = {
  notes: {
    'ui:widget': 'textarea',
  },
}

export default function StudentDetail() {
  const router = useRouter()
  const { id } = router.query
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadStudent()
    }
  }, [id])

  const loadStudent = async () => {
    try {
      const data = await getStudent(id as string)
      setStudent(data)
    } catch (err) {
      setError('Failed to load student')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async ({ formData }: { formData: any }) => {
    try {
      const updatedStudent = await updateStudent(id as string, formData)
      setStudent(updatedStudent)
      router.push(`/classrooms/${student?.classroom_id}/students`)
    } catch (err) {
      setError('Failed to update student')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this student?')) {
      return
    }

    try {
      await deleteStudent(id as string)
      router.push(`/classrooms/${student?.classroom_id}/students`)
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

  if (!student) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Student not found
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
              Edit Student
            </h1>
            <p className="text-gray-600">
              {student.first_name} {student.last_name}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/classrooms/${student.classroom_id}/students`}
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
            schema={studentSchema}
            uiSchema={uiSchema}
            formData={student}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  )
}
