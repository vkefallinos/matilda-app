import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClassroomSchema, type Classroom } from '@/schemas/zod/classroom'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Initialize Supabase client with auth context
  const supabase = createPagesServerClient({ req, res })

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      try {
        const { data: classrooms, error } = await supabase
          .from('classrooms')
          .select('*')
          .eq('teacher_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          return res.status(400).json({ error: error.message })
        }

        return res.status(200).json(classrooms)
      } catch (error) {
        console.error('Error fetching classrooms:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'POST':
      try {
        const validation = createClassroomSchema.safeParse(req.body)
        
        if (!validation.success) {
          return res.status(400).json({ 
            error: 'Invalid input',
            details: validation.error.errors 
          })
        }

        // Insert with explicit teacher_id from the session
        const { data: classroom, error } = await supabase
          .from('classrooms')
          .insert({
            ...validation.data,
            teacher_id: session.user.id,
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          return res.status(400).json({ error: error.message })
        }

        return res.status(201).json(classroom)
      } catch (error) {
        console.error('Error creating classroom:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
