"use server"

import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'
import type { ActionResult } from '@/types'

/**
 * Kullanici girisi server action'i.
 * Email ve parola ile kimlik dogrulama yapar.
 * @param formData - email ve password alanlari
 */
export async function login(formData: FormData): Promise<ActionResult<void>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email ve sifre zorunludur' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Email veya sifre hatali' }
    }
    return { success: false, error: 'Giris yapilirken bir hata olustu' }
  }
}

/**
 * Kullanici cikisi server action'i.
 */
export async function logout(): Promise<void> {
  await signOut({ redirectTo: '/login' })
}
