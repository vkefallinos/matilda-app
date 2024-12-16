import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  // Don't show navigation on auth pages
  if (router.pathname.startsWith('/auth/')) {
    return <main>{children}</main>
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">Matilda</span>
            </div>
            {user && (
              <div className="flex items-center">
                <button
                  onClick={handleSignOut}
                  className="btn-secondary ml-4"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
