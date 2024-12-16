export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return String(error)
}

export const handleAuthError = (error: unknown): string => {
  const message = getErrorMessage(error)
  
  // Handle common Supabase auth errors
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password'
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address'
  }
  if (message.includes('Email already registered')) {
    return 'An account with this email already exists'
  }
  
  return 'An unexpected error occurred. Please try again.'
}
