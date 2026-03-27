import { Sidebar } from './Sidebar'
import { Header } from './Header'
import type { SessionUser } from '@/types'

type DashboardShellProps = {
  user: SessionUser
  children: React.ReactNode
}

/**
 * Dashboard ana cerceve bileseni.
 * Sidebar + Header + icerik alani duzenini saglar.
 */
export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="flex flex-col flex-1">
        <Header user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
