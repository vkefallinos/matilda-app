import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2),
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
    const validationResult = registerSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.issues 
      })
    }

    const { email, password, full_name } = validationResult.data

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user' })
    }

    // Create profile using service role client
    const { error: profileError } = await supabase.auth.getSession().then(async ({ data: { session }}) => {
      return supabase
        .from('profiles')
        .insert({
          id: authData.user!.id,
          email,
          full_name,
        })
        .single()
    })

    if (profileError) {
      // Attempt to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return res.status(400).json({ error: profileError.message })
    }

    return res.status(200).json({ 
      message: 'Registration successful',
      user: authData.user 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
