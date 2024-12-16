import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { studentFormSchema, transformFormToDb } from '@/schemas/zod/student'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res })

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const classroomId = req.query.classroomId
      if (!classroomId || typeof classroomId !== 'string') {
        return res.status(400).json({ error: 'Classroom ID is required' })
      }

      // Validate form data
      const validationResult = studentFormSchema.safeParse(req.body)
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        })
      }

      // Transform form data to database schema
      const data = transformFormToDb(validationResult.data, classroomId)

      // Verify teacher owns the classroom
      const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .select()
        .eq('id', classroomId)
        .eq('teacher_id', session.user.id)
        .single()

      if (classroomError || !classroom) {
        return res.status(404).json({ error: 'Classroom not found' })
      }

      const { data: student, error } = await supabase
        .from('students')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Error creating student:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(201).json(student)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      // Get all students for the teacher's classrooms
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          *,
          classroom:classrooms(*)
        `)
        .eq('classroom.teacher_id', session.user.id)
        .order('last_name', { ascending: true })

      if (error) {
        console.error('Error fetching students:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(students)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
