import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import FormInput from './FormInput'
import { signIn } from '../lib/auth-service'
import { handleAuthError } from '../lib/error-handler'

export default function SignInForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(formData)
      router.push('/dashboard')
    } catch (err) {
      setError(handleAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
      
      {error && (
        <div className="bg-red-50 text-error p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
        />

        <FormInput
          label="Password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
        />

        <button
          type="submit"
          className="btn-primary w-full mb-4"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
