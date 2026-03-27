import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

/**
 * Next.js Middleware — route korumasi.
 * Edge runtime'da calisir; veritabani erisimi olmadan sadece JWT dogrular.
 * - /dashboard/* → giris yapilmamissa /login'e yonlendirir
 * - /dashboard/admin/* → sadece admin
 * - /dashboard/worker/* → sadece worker
 * - /login → giris yapilmissa dashboard'a yonlendirir
 */
const { auth } = NextAuth(authConfig)
export default auth
export const proxy = auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
