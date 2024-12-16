import { AppProps } from 'next/app'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import SessionProvider from '../components/SessionProvider'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </SessionContextProvider>
  )
}

export default MyApp
