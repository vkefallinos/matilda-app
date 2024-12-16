import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createQuizSchema } from '@/schemas/zod/quiz'

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
      const lessonPlanId = req.query.lessonPlanId
      if (!lessonPlanId || typeof lessonPlanId !== 'string') {
        return res.status(400).json({ error: 'Lesson plan ID is required' })
      }

      const { quiz: quizData, assigned_student_ids } = req.body
      const { questions, ...quizDetails } = quizData

      // Calculate total points from questions
      const total_points = questions?.reduce((sum, q) => sum + q.points, 0) || 0

      // Validate quiz data
      const validationResult = createQuizSchema.safeParse({
        ...quizDetails,
        questions,
        total_points,
        lesson_plan_id: lessonPlanId,
      })

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        })
      }

      const { questions: validatedQuestions, ...quizDataToInsert } = validationResult.data

      // Verify teacher owns the lesson plan through classroom
      const { data: lessonPlan, error: lessonPlanError } = await supabase
        .from('lesson_plans')
        .select(`
          *,
          classroom:classrooms!inner(*)
        `)
        .eq('id', lessonPlanId)
        .eq('classroom.teacher_id', session.user.id)
        .single()

      if (lessonPlanError || !lessonPlan) {
        return res.status(404).json({ error: 'Lesson plan not found' })
      }

      // Start a transaction for quiz creation
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([quizDataToInsert])
        .select()
        .single()

      if (quizError) {
        console.error('Error creating quiz:', quizError)
        return res.status(400).json({ error: quizError.message })
      }

      // Insert quiz questions
      if (validatedQuestions && validatedQuestions.length > 0) {
        const questionsData = validatedQuestions.map(({ id, ...question }) => ({
          ...question,
          quiz_id: quiz.id
        }))

        const { error: questionsError } = await supabase
          .from('quiz_questions')
          .insert(questionsData)

        if (questionsError) {
          console.error('Error creating quiz questions:', questionsError)
          // Consider rolling back the quiz creation here if questions fail
          return res.status(400).json({ error: questionsError.message })
        }
      }

      // Create student assignments if any students are assigned
      if (assigned_student_ids && assigned_student_ids.length > 0) {
        const assignments = assigned_student_ids.map(studentId => ({
          student_id: studentId,
          quiz_id: quiz.id,
          status: 'assigned'
        }))

        const { error: assignmentError } = await supabase
          .from('student_assignments')
          .insert(assignments)

        if (assignmentError) {
          console.error('Error creating assignments:', assignmentError)
          // Don't return error here, as the quiz was created successfully
        }
      }

      // Get the complete quiz data with questions
      const { data: completeQuiz, error: fetchError } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions(*)
        `)
        .eq('id', quiz.id)
        .single()

      if (fetchError) {
        console.error('Error fetching complete quiz:', fetchError)
        return res.status(400).json({ error: fetchError.message })
      }

      return res.status(201).json(completeQuiz)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      const lessonPlanId = req.query.lessonPlanId
      if (!lessonPlanId || typeof lessonPlanId !== 'string') {
        return res.status(400).json({ error: 'Lesson plan ID is required' })
      }

      // Get all quizzes for the lesson plan (verifying teacher ownership)
      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions(*),
          lesson_plan:lesson_plans!inner(
            *,
            classroom:classrooms!inner(*)
          ),
          student_assignments(
            student_id,
            status,
            score,
            completed_at
          )
        `)
        .eq('lesson_plan_id', lessonPlanId)
        .eq('lesson_plan.classroom.teacher_id', session.user.id)

      if (error) {
        console.error('Error fetching quizzes:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(quizzes)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
