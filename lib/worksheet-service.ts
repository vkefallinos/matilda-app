import type { CreateWorksheet, Worksheet, UpdateWorksheet } from '@/schemas/zod/worksheet'

export const createWorksheet = async (formData: CreateWorksheet) => {
  const { lesson_plan_id, assigned_student_ids, ...worksheetData } = formData
  const res = await fetch(`/api/worksheets?lessonPlanId=${lesson_plan_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      worksheet: worksheetData,
      assigned_student_ids: assigned_student_ids || []
    }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getWorksheetsByLessonPlan = async (lessonPlanId: string) => {
  const res = await fetch(`/api/worksheets?lessonPlanId=${lessonPlanId}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getWorksheet = async (id: string) => {
  const res = await fetch(`/api/worksheets/${id}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const updateWorksheet = async (id: string, data: UpdateWorksheet) => {
  const res = await fetch(`/api/worksheets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const deleteWorksheet = async (id: string) => {
  const res = await fetch(`/api/worksheets/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const assignWorksheetToStudents = async (id: string, studentIds: string[]) => {
  const res = await fetch(`/api/worksheets/${id}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ student_ids: studentIds }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}
