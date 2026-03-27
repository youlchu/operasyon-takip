"use client"

import { useSession } from 'next-auth/react'
import type { SessionUser } from '@/types'

/**
 * Mevcut oturumdaki kullanici bilgisini donduren hook.
 * SessionUser tipinde veri veya null dondurur.
 */
export function useCurrentUser(): SessionUser | null {
  const { data: session } = useSession()
  return session?.user ?? null
}
