import { Classroom } from '../types/database'

// Transform form data to match database schema
const transformFormData = (data: any) => {
  return {
    name: data.name,
    description: data.description,
    grade_level: data.grade_level,
    subject: data.subject,
    academic_year: data.academic_year,
  }
}

export const createClassroom = async (data: any) => {
  const transformedData = transformFormData(data)
  
  const res = await fetch('/api/classrooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData),
    // Include credentials to ensure auth cookie is sent
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to create classroom:', error)
    throw new Error(error.error || 'Failed to create classroom')
  }

  return res.json()
}

export const updateClassroom = async (id: string, data: Partial<Classroom>) => {
  const transformedData = transformFormData(data)

  const res = await fetch(`/api/classrooms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData),
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to update classroom:', error)
    throw new Error(error.error || 'Failed to update classroom')
  }

  return res.json()
}

export const deleteClassroom = async (id: string) => {
  const res = await fetch(`/api/classrooms/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to delete classroom:', error)
    throw new Error(error.error || 'Failed to delete classroom')
  }
}

export const getClassroom = async (id: string) => {
  const res = await fetch(`/api/classrooms/${id}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to fetch classroom:', error)
    throw new Error(error.error || 'Failed to fetch classroom')
  }

  return res.json()
}

export const getClassrooms = async () => {
  const res = await fetch('/api/classrooms', {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to fetch classrooms:', error)
    throw new Error(error.error || 'Failed to fetch classrooms')
  }

  return res.json()
}
