import { Student } from '../types/database'
import { StudentForm } from '../schemas/zod/student'

export const createStudent = async (formData: StudentForm, classroomId: string) => {
  const res = await fetch(`/api/students?classroomId=${classroomId}`, {
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

export const updateStudent = async (id: string, formData: Partial<StudentForm>, classroomId: string) => {
  const res = await fetch(`/api/students/${id}?classroomId=${classroomId}`, {
    method: 'PUT',
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

export const deleteStudent = async (id: string) => {
  const res = await fetch(`/api/students/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getStudent = async (id: string) => {
  const res = await fetch(`/api/students/${id}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}

export const getStudentsByClassroom = async (classroomId: string) => {
  const res = await fetch(`/api/classrooms/${classroomId}/students`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return res.json()
}
