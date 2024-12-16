import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateLessonPlanSchema } from '@/schemas/zod/lesson-plan'

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

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Lesson plan ID is required' })
  }

  // Verify teacher owns the lesson plan through classroom
  const { data: lessonPlan, error: lessonPlanError } = await supabase
    .from('lesson_plans')
    .select(`
      *,
      classroom:classrooms!inner(*)
    `)
    .eq('id', id)
    .eq('classroom.teacher_id', session.user.id)
    .single()

  if (lessonPlanError || !lessonPlan) {
    return res.status(404).json({ error: 'Lesson plan not found' })
  }

  if (req.method === 'GET') {
    return res.status(200).json(lessonPlan)
  } else if (req.method === 'PUT') {
    try {
      // Validate update data
      const validationResult = updateLessonPlanSchema.safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Invalid request data',
          details: validationResult.error.errors
        })
      }

      const { data: updatedLessonPlan, error } = await supabase
        .from('lesson_plans')
        .update(validationResult.data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating lesson plan:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(updatedLessonPlan)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('lesson_plans')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lesson plan:', error)
      return res.status(400).json({ error: error.message })
    }

    return res.status(204).end()
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
