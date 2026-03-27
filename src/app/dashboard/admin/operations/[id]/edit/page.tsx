export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getOperationById } from '@/lib/queries/operations'
import { getWorkers } from '@/lib/queries/workers'
import { OperationForm } from '@/components/operations/OperationForm'

type EditOperationPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Operasyon duzenleme sayfasi.
 */
export default async function EditOperationPage({ params }: EditOperationPageProps) {
  const { id } = await params
  const [operation, workers] = await Promise.all([getOperationById(id), getWorkers()])

  if (!operation) notFound()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Operasyonu Duzenle</h1>
      <OperationForm operation={operation} workers={workers} />
    </div>
  )
}
