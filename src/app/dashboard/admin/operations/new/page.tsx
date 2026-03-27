export const dynamic = 'force-dynamic'

import { getWorkers } from '@/lib/queries/workers'
import { OperationForm } from '@/components/operations/OperationForm'

/**
 * Yeni operasyon olusturma sayfasi.
 */
export default async function NewOperationPage() {
  const workers = await getWorkers()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Yeni Operasyon</h1>
      <OperationForm workers={workers} />
    </div>
  )
}
