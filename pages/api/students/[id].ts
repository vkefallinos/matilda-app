import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateStudentSchema } from '@/schemas/zod/student'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res })
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid student ID' })
  }

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Verify teacher owns the student's classroom
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select(`
      *,
      classroom:classrooms(*)
    `)
    .eq('id', id)
    .eq('classroom.teacher_id', session.user.id)
    .single()

  if (studentError || !student) {
    return res.status(404).json({ error: 'Student not found' })
  }

  switch (req.method) {
    case 'GET':
      return res.status(200).json(student)

    case 'PUT':
      try {
        // Validate request body
        const validationResult = updateStudentSchema.safeParse(req.body)
        if (!validationResult.success) {
          return res.status(400).json({ 
            error: 'Invalid request data',
            details: validationResult.error.errors 
          })
        }

        const data = validationResult.data

        // Verify new classroom belongs to teacher if classroom is being changed
        if (data.classroom_id && data.classroom_id !== student.classroom_id) {
          const { data: classroom, error: classroomError } = await supabase
            .from('classrooms')
            .select()
            .eq('id', data.classroom_id)
            .eq('teacher_id', session.user.id)
            .single()

          if (classroomError || !classroom) {
            return res.status(400).json({ error: 'Invalid classroom' })
          }
        }

        const { data: updatedStudent, error } = await supabase
          .from('students')
          .update(data)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Error updating student:', error)
          return res.status(400).json({ error: error.message })
        }

        return res.status(200).json(updatedStudent)
      } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting student:', error)
          return res.status(400).json({ error: error.message })
        }

        return res.status(204).end()
      } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
