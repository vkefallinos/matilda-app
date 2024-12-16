import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('classroom_id', id)
      .order('last_name', { ascending: true })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
