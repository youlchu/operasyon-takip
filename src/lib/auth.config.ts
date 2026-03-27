import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-uyumlu NextAuth yapilandirmasi.
 * Veritabani erisimi olmadan calisir; middleware icin kullanilir.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    /**
     * JWT callback: role ve id'yi token'a ekler (proxy icin gerekli).
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    /**
     * Session callback: token'daki role ve id'yi session'a tasir (proxy icin gerekli).
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    /**
     * Route korumasi: yetkisiz erisimi engeller, rol bazli yonlendirme yapar.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnLogin = nextUrl.pathname === '/login' || nextUrl.pathname === '/'

      if (isOnDashboard) {
        if (!isLoggedIn) return false // login'e yonlendirilir
        // Rol bazli erisim kontrolu
        const role = (auth?.user as { role?: string })?.role
        if (nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
          return Response.redirect(new URL('/dashboard/worker', nextUrl))
        }
        if (nextUrl.pathname.startsWith('/dashboard/worker') && role !== 'worker') {
          return Response.redirect(new URL('/dashboard/admin', nextUrl))
        }
        return true
      }

      if (isOnLogin && isLoggedIn) {
        // Giris yapilmissa uygun dashboard'a yonlendir
        const role = (auth?.user as { role?: string })?.role
        const redirectUrl = role === 'admin' ? '/dashboard/admin' : '/dashboard/worker'
        return Response.redirect(new URL(redirectUrl, nextUrl))
      }

      return true
    },
  },
  providers: [], // Credentials provider auth.ts'de eklenir
}
