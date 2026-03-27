"use client"

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

/**
 * NextAuth.js SessionProvider sarici bileseni.
 * Root layout'ta kullanilir; tum client componentlerin session'a erisimini saglar.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
