import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import ClassroomCard from '../../components/ClassroomCard'
import { getClassrooms, deleteClassroom } from '../../lib/classroom-service'
import type { Classroom } from '../../types/database'

export default function Classrooms() {
  const router = useRouter()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadClassrooms()
  }, [])

  const loadClassrooms = async () => {
    try {
      const data = await getClassrooms()
      setClassrooms(data)
    } catch (err) {
      setError('Failed to load classrooms')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this classroom?')) {
      return
    }

    try {
      await deleteClassroom(id)
      setClassrooms(classrooms.filter(c => c.id !== id))
    } catch (err) {
      setError('Failed to delete classroom')
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Classrooms</h1>
          <Link href="/classrooms/new" className="btn-primary">
            Create Classroom
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {classrooms.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classrooms yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first classroom
            </p>
            <Link href="/classrooms/new" className="btn-primary">
              Create Classroom
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
