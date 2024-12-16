import { SupabaseAuthPayload } from '../types'

export const signIn = async (payload: SupabaseAuthPayload) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  
  return res.json()
}

export const register = async (payload: SupabaseAuthPayload & { full_name: string }) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  
  return res.json()
}

export const signOut = async () => {
  const res = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  
  return res.json()
}

export const getSession = async () => {
  const res = await fetch('/api/auth/session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  
  return res.json()
}
