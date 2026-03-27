export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getOperations } from '@/lib/queries/operations'
import { OperationCard } from '@/components/operations/OperationCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { OperationStatus, Priority } from '@/types'

type SearchParams = Promise<{
  status?: string
  priority?: string
}>

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'Tum Durumlar' },
  { value: 'draft', label: 'Taslak' },
  { value: 'in_progress', label: 'Devam Ediyor' },
  { value: 'completed', label: 'Tamamlandi' },
  { value: 'cancelled', label: 'Iptal Edildi' },
]

const priorityOptions: { value: string; label: string }[] = [
  { value: '', label: 'Tum Oncelikler' },
  { value: 'low', label: 'Dusuk' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yuksek' },
  { value: 'critical', label: 'Kritik' },
]

/**
 * Operasyon listesi sayfasi.
 * Durum ve oncelik filtreleme destekler.
 */
export default async function OperationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const operations = await getOperations()

  const filtered = operations.filter((op) => {
    const statusMatch = !params.status || op.status === (params.status as OperationStatus)
    const priorityMatch = !params.priority || op.priority === (params.priority as Priority)
    return statusMatch && priorityMatch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Operasyonlar</h1>
        <Link
          href="/dashboard/admin/operations/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Yeni Operasyon
        </Link>
      </div>

      {/* Filtreler */}
      <form className="flex gap-3 mb-6">
        <select
          name="status"
          defaultValue={params.status ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="priority"
          defaultValue={params.priority ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          Filtrele
        </button>
      </form>

      {/* Liste */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Operasyon bulunamadi"
          description="Henuz operasyon olusturulmamis veya filtrelerinize uyan operasyon yok."
          action={
            <Link
              href="/dashboard/admin/operations/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Ilk Operasyonu Olustur
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((op) => (
            <OperationCard key={op.id} operation={op} />
          ))}
        </div>
      )}
    </div>
  )
}
