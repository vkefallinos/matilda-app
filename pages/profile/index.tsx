import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Avatar from '../../components/Avatar'
import SchemaForm from '../../components/SchemaForm'
import { getProfile, updateProfile } from '../../lib/profile-service'
import { useSession } from '../../lib/hooks/useSession'
import type { Profile } from '../../types/database'

const profileSchema = {
  type: 'object',
  required: ['full_name', 'email'],
  properties: {
    full_name: {
      type: 'string',
      title: 'Full Name',
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      readOnly: true,
    },
  },
}

const uiSchema = {
  email: {
    'ui:disabled': true,
  },
}

export default function ProfilePage() {
  const { session, loading: sessionLoading } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async ({ formData }: { formData: any }) => {
    try {
      const updatedProfile = await updateProfile(formData)
      setProfile(updatedProfile)
      setError('')
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const handleAvatarUpload = (url: string) => {
    setProfile(profile => profile ? { ...profile, avatar_url: url } : null)
  }

  if (sessionLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!session || !profile) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please sign in to view your profile
            </h3>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and profile picture
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-6">
            <Avatar
              url={profile.avatar_url}
              size={150}
              onUpload={handleAvatarUpload}
            />
          </div>

          <SchemaForm
            schema={profileSchema}
            uiSchema={uiSchema}
            formData={profile}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  )
}
