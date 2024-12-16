import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SignInForm from '../../components/SignInForm'

export default function SignIn() {
  const router = useRouter()
  const { registered } = router.query

  useEffect(() => {
    // Show registration success message if redirected from registration
    if (registered) {
      alert('Registration successful! Please sign in with your credentials.')
      // Remove the query parameter
      router.replace('/auth/signin', undefined, { shallow: true })
    }
  }, [registered, router])

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary">Matilda</h2>
            <p className="mt-2 text-gray-600">Teacher Management Platform</p>
          </div>
          <SignInForm />
        </div>
      </div>
    </Layout>
  )
}
