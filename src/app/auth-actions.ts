'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !username || !fullName) {
    return { error: 'All fields are required' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        username,
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Check if session was created automatically (email confirmation might be disabled in Supabase)
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  return { success: 'Check your email to confirm your account!' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return {
    ...user,
    profile,
  }
}
