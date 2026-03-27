import { handlers } from '@/lib/auth'

/**
 * NextAuth.js v5 catch-all route handler.
 * GET ve POST metodlarini isler (login, logout, session vb.).
 */
export const { GET, POST } = handlers
