export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getActiveStepsByWorker } from '@/lib/queries/steps'
import { ActiveStepCard } from '@/components/worker/ActiveStepCard'
import { WorkerDashboardRefresher } from '@/components/worker/WorkerDashboardRefresher'
import { EmptyState } from '@/components/ui/EmptyState'
/**
 * Isci ana dashboard sayfasi.
 * Kullaniciya atanmis ve sirasi gelmis aktif adimlari kart olarak gosterir.
 * 30 saniyede bir otomatik yenilenir.
 */
export default async function WorkerDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const steps = await getActiveStepsByWorker(session.user.id)

  return (
    <div>
      <WorkerDashboardRefresher />

      <h1 className="text-xl font-bold text-gray-900 mb-6">Gorevlerim</h1>

      {steps.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Bekleyen gorev yok"
          description="Simdilik size atanmis aktif bir adim bulunmuyor. Yeni bir adim atandiginda burada gorunur."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {steps.map((step) => (
            <ActiveStepCard key={step.id} step={step} />
          ))}
        </div>
      )}
    </div>
  )
}
