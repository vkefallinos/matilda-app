import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createPagesServerClient({ req, res })

    // Validate request body
    const validationResult = signInSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.issues 
      })
    }

    const { email, password } = validationResult.data

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    return res.status(200).json({ 
      session: data.session,
      user: data.user
    })
  } catch (error) {
    console.error('Sign in error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
