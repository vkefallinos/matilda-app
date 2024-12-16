export type Profile = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type AuthError = {
  message: string
}

export type AuthState = {
  loading: boolean
  error: AuthError | null
  user: Profile | null
}

export type SupabaseAuthPayload = {
  email: string
  password: string
}
