import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getCompletedStepsByWorker } from '@/lib/queries/steps'
import { CompletedStepCard } from '@/components/worker/CompletedStepCard'
import { EmptyState } from '@/components/ui/EmptyState'
/**
 * Isci tamamlanan adimlar gecmis sayfasi.
 */
export default async function WorkerHistoryPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const steps = await getCompletedStepsByWorker(session.user.id)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Gecmis</h1>

      {steps.length === 0 ? (
        <EmptyState
          title="Henuz tamamlanan adim yok"
          description="Tamamladiginiz adimlar burada listelenecek."
        />
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {steps.map((step) => (
            <CompletedStepCard key={step.id} step={step} />
          ))}
        </div>
      )}
    </div>
  )
}
