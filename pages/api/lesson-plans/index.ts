import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { lessonPlanSchema } from '@/schemas/zod/lesson-plan'

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

      // Validate request body
      const validationResult = lessonPlanSchema.safeParse({
        ...req.body,
        classroom_id: classroomId,
        teacher_id: session.user.id,
      })

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        })
      }

      const data = validationResult.data

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

      const { data: lessonPlan, error } = await supabase
        .from('lesson_plans')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Error creating lesson plan:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(201).json(lessonPlan)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      const classroomId = req.query.classroomId
      if (!classroomId || typeof classroomId !== 'string') {
        return res.status(400).json({ error: 'Classroom ID is required' })
      }

      // Get all lesson plans for the classroom (verifying teacher ownership)
      const { data: lessonPlans, error } = await supabase
        .from('lesson_plans')
        .select(`
          *,
          classroom:classrooms!inner(*)
        `)
        .eq('classroom_id', classroomId)
        .eq('classroom.teacher_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching lesson plans:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(lessonPlans)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
