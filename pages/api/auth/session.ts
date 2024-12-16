import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

// Initialize service role client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createPagesServerClient({ req, res })
    
    let { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session:', session)
    console.log('Session Error:', sessionError)

    if (sessionError) {
      return res.status(400).json({ error: sessionError.message })
    }

    if (!session) {
      return res.status(401).json({ error: 'No active session' })
    }

    // Check if session is about to expire (within 60 minutes)
    const expiresAt = new Date(session.expires_at! * 1000)
    const now = new Date()
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    const HOUR_IN_MS = 60 * 60 * 1000

    if (timeUntilExpiry < HOUR_IN_MS) {
      // Refresh the session
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession()
      console.log('Refreshed Session:', refreshedSession)
      console.log('Refresh Error:', refreshError)

      if (refreshError) {
        return res.status(400).json({ error: refreshError.message })
      }

      if (!refreshedSession) {
        return res.status(401).json({ error: 'Failed to refresh session' })
      }

      session = refreshedSession
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, created_at, updated_at')
      .eq('id', session.user.id)
      .maybeSingle()
    
    console.log('Profile:', profile)
    console.log('Profile Error:', profileError)

    if (profileError) {
      return res.status(400).json({ error: profileError.message })
    }

    // If no profile exists, create one using service role client
    if (!profile) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name || 'Unknown',
        })
        .select()
        .single()

      if (createError) {
        console.error('Profile creation error:', createError)
        return res.status(400).json({ error: createError.message })
      }

      return res.status(200).json({ session, profile: newProfile })
    }

    return res.status(200).json({ session, profile })
  } catch (error) {
    console.error('Session error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
