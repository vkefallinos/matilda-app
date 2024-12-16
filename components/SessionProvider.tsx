import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/auth-helpers-nextjs'
import type { Profile } from '../types/database'

interface SessionContextType {
  session: Session | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  profile: null,
  loading: true,
  error: null,
})

export function useSessionContext() {
  return useContext(SessionContext)
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          if (response.status === 401) {
            setSession(null)
            setProfile(null)
            if (!router.pathname.startsWith('/auth')) {
              router.push('/auth/signin')
            }
          } else {
            throw new Error('Failed to fetch session')
          }
          return
        }

        const { session, profile } = await response.json()
        setSession(session)
        setProfile(profile)
      } catch (err) {
        setError('Failed to check session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        checkSession()
      } else {
        setSession(null)
        setProfile(null)
        if (!router.pathname.startsWith('/auth')) {
          router.push('/auth/signin')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <SessionContext.Provider value={{ session, profile, loading, error }}>
      {children}
    </SessionContext.Provider>
  )
}
