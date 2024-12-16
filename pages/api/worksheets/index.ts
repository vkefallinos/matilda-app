import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createWorksheetSchema } from '@/schemas/zod/worksheet'

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

      const { worksheet: worksheetData, assigned_student_ids } = req.body
      const { items, ...worksheetDetails } = worksheetData

      // Validate worksheet data
      const validationResult = createWorksheetSchema.safeParse({
        ...worksheetDetails,
        items,
        lesson_plan_id: lessonPlanId,
      })

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        })
      }

      const { items: validatedItems, ...worksheetDataToInsert } = validationResult.data

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

      // Start a transaction for worksheet creation
      const { data: worksheet, error: worksheetError } = await supabase
        .from('worksheets')
        .insert([worksheetDataToInsert])
        .select()
        .single()

      if (worksheetError) {
        console.error('Error creating worksheet:', worksheetError)
        return res.status(400).json({ error: worksheetError.message })
      }

      // Insert worksheet items
      if (validatedItems && validatedItems.length > 0) {
        const itemsData = validatedItems.map(({ id, resources, ...item }) => ({
          ...item,
          worksheet_id: worksheet.id,
          resources: resources ? JSON.stringify(resources) : null
        }))

        const { error: itemsError } = await supabase
          .from('worksheet_items')
          .insert(itemsData)

        if (itemsError) {
          console.error('Error creating worksheet items:', itemsError)
          // Consider rolling back the worksheet creation here if items fail
          return res.status(400).json({ error: itemsError.message })
        }
      }

      // Create student assignments if any students are assigned
      if (assigned_student_ids && assigned_student_ids.length > 0) {
        const assignments = assigned_student_ids.map(studentId => ({
          student_id: studentId,
          worksheet_id: worksheet.id,
          status: 'assigned'
        }))

        const { error: assignmentError } = await supabase
          .from('student_assignments')
          .insert(assignments)

        if (assignmentError) {
          console.error('Error creating assignments:', assignmentError)
          // Don't return error here, as the worksheet was created successfully
        }
      }

      // Get the complete worksheet data with items
      const { data: completeWorksheet, error: fetchError } = await supabase
        .from('worksheets')
        .select(`
          *,
          worksheet_items(*)
        `)
        .eq('id', worksheet.id)
        .single()

      if (fetchError) {
        console.error('Error fetching complete worksheet:', fetchError)
        return res.status(400).json({ error: fetchError.message })
      }

      return res.status(201).json(completeWorksheet)
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

      // Get all worksheets for the lesson plan (verifying teacher ownership)
      const { data: worksheets, error } = await supabase
        .from('worksheets')
        .select(`
          *,
          worksheet_items(*),
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
        console.error('Error fetching worksheets:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(worksheets)
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
