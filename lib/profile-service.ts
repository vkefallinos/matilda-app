import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Profile } from '../types/database'

const supabase = createClientComponentClient()

export async function getProfile() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(profile: Partial<Profile>) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No session')

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', session.user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadAvatar(file: File) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No session')

  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}-${Math.random()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', session.user.id)

  if (updateError) throw updateError

  return publicUrl
}
