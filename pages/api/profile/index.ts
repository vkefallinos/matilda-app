import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateProfileSchema } from '@/schemas/zod/profile'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    switch (req.method) {
      case 'GET':
        const { data: profile, error: getError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (getError) {
          return res.status(500).json({ error: getError.message })
        }

        return res.status(200).json(profile)

      case 'PUT':
        const validationResult = updateProfileSchema.safeParse(req.body)

        if (!validationResult.success) {
          return res.status(400).json({ error: validationResult.error.errors })
        }

        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(validationResult.data)
          .eq('id', user.id)
          .select()
          .single()

        if (updateError) {
          return res.status(500).json({ error: updateError.message })
        }

        return res.status(200).json(updatedProfile)

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
