import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import Layout from '../components/Layout'

export default function Home() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    } else {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    </Layout>
  )
}
