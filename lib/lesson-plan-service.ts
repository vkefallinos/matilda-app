import type { LessonPlan } from '../types/database'

export const createLessonPlan = async (formData: any, classroomId: string) => {
  const res = await fetch(`/api/lesson-plans?classroomId=${classroomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getLessonPlansByClassroom = async (classroomId: string) => {
  const res = await fetch(`/api/lesson-plans?classroomId=${classroomId}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getLessonPlan = async (id: string) => {
  const res = await fetch(`/api/lesson-plans/${id}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const updateLessonPlan = async (id: string, data: Partial<LessonPlan>) => {
  const res = await fetch(`/api/lesson-plans/${id}`, {
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

export const deleteLessonPlan = async (id: string) => {
  const res = await fetch(`/api/lesson-plans/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}
