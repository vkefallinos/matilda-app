import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateClassroomSchema, type Classroom } from '@/schemas/zod/classroom'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res })
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid classroom ID' })
  }

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Verify classroom ownership
  const { data: classroom, error: fetchError } = await supabase
    .from('classrooms')
    .select('*')
    .eq('id', id)
    .eq('teacher_id', session.user.id)
    .single()

  if (fetchError || !classroom) {
    return res.status(404).json({ error: 'Classroom not found' })
  }

  switch (req.method) {
    case 'GET':
      return res.status(200).json(classroom)

    case 'PUT':
      try {
        const validation = updateClassroomSchema.safeParse(req.body)
        
        if (!validation.success) {
          return res.status(400).json({ 
            error: 'Invalid input',
            details: validation.error.errors 
          })
        }

        const { data: updatedClassroom, error } = await supabase
          .from('classrooms')
          .update(validation.data)
          .eq('id', id)
          .eq('teacher_id', session.user.id)
          .select()
          .single()

        if (error) {
          return res.status(400).json({ error: error.message })
        }

        return res.status(200).json(updatedClassroom)
      } catch (error) {
        console.error('Error updating classroom:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('classrooms')
          .delete()
          .eq('id', id)
          .eq('teacher_id', session.user.id)

        if (error) {
          return res.status(400).json({ error: error.message })
        }

        return res.status(204).send(null)
      } catch (error) {
        console.error('Error deleting classroom:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
