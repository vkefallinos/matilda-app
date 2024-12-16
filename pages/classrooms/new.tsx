import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SchemaForm from '../../components/SchemaForm'
import { classroomSchema } from '../../schemas/classroom'
import { createClassroom } from '../../lib/classroom-service'

export default function NewClassroom() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: any) => {
    setError('')
    setLoading(true)

    try {
      await createClassroom(formData)
      router.push('/classrooms')
    } catch (err) {
      setError('Failed to create classroom')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Classroom
        </h1>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <SchemaForm
            schema={classroomSchema.schema}
            uiSchema={classroomSchema.uiSchema}
            onSubmit={handleSubmit}
            submitText="Create Classroom"
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  )
}
