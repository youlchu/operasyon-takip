import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from './auth.config'
import type { Role } from '@/types'

/**
 * NextAuth.js v5 yapilandirmasi.
 * Credentials provider ile email/parola dogrulama yapar.
 * JWT strategy: session veritabaninda tutulmaz.
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        if (!email || !password) return null

        const user = await db.user.findUnique({ where: { email } })
        if (!user) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * JWT callback: kullanici bilgilerini (id, role) token'a ekler.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: Role }).role
      }
      return token
    },
    /**
     * Session callback: token'daki bilgileri session'a tasir.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
})
