export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getWorkerById } from '@/lib/queries/workers'
import { WorkerForm } from '@/components/workers/WorkerForm'

type EditWorkerPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Isci duzenleme sayfasi.
 */
export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params
  const worker = await getWorkerById(id)

  if (!worker) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Isciiyi Duzenle</h1>
      <WorkerForm worker={worker} />
    </div>
  )
}
