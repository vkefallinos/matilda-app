import type { CreateQuiz, Quiz, UpdateQuiz } from '@/schemas/zod/quiz'

export const createQuiz = async (formData: CreateQuiz) => {
  const { lesson_plan_id, assigned_student_ids, ...quizData } = formData
  const res = await fetch(`/api/quizzes?lessonPlanId=${lesson_plan_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quiz: quizData,
      assigned_student_ids: assigned_student_ids || []
    }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getQuizzesByLessonPlan = async (lessonPlanId: string) => {
  const res = await fetch(`/api/quizzes?lessonPlanId=${lessonPlanId}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getQuiz = async (id: string) => {
  const res = await fetch(`/api/quizzes/${id}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const updateQuiz = async (id: string, data: UpdateQuiz) => {
  const res = await fetch(`/api/quizzes/${id}`, {
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

export const deleteQuiz = async (id: string) => {
  const res = await fetch(`/api/quizzes/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const assignQuizToStudents = async (id: string, studentIds: string[]) => {
  const res = await fetch(`/api/quizzes/${id}/assign`, {
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
