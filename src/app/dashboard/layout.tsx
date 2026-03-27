import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/DashboardShell'

/**
 * Dashboard ortak layout.
 * Session kontrolu yapar; giris yapilmamissa /login'e yonlendirir.
 * DashboardShell ile sidebar + header + icerik alani saglar.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>
}
