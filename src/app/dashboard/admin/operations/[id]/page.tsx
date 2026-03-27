import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOperationById } from '@/lib/queries/operations'
import { OperationTimeline } from '@/components/operations/OperationTimeline'
import { OperationStatusBadge } from '@/components/operations/OperationStatusBadge'
import { PriorityBadge } from '@/components/operations/PriorityBadge'
import { OperationActions } from '@/components/operations/OperationActions'
import { formatDate } from '@/lib/utils'

type OperationDetailPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Operasyon detay sayfasi.
 * Adim timeline, durum bilgisi, baslatma/iptal butonlarini gosterir.
 */
export default async function OperationDetailPage({ params }: OperationDetailPageProps) {
  const { id } = await params
  const operation = await getOperationById(id)

  if (!operation) notFound()

  return (
    <div className="max-w-3xl">
      {/* Baslik ve aksiyonlar */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/admin/operations"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Operasyonlar
            </Link>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{operation.title}</h1>
          <div className="flex items-center gap-2">
            <OperationStatusBadge status={operation.status} />
            <PriorityBadge priority={operation.priority} />
          </div>
        </div>

        <OperationActions operation={operation} />
      </div>

      {/* Aciklama */}
      {operation.description && (
        <p className="text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
          {operation.description}
        </p>
      )}

      {/* Meta bilgiler */}
      <div className="flex gap-6 text-xs text-gray-500 mb-6">
        <span>Olusturan: {operation.creator.name}</span>
        <span>Tarih: {formatDate(operation.createdAt)}</span>
        <span>Adim: {operation.steps.length}</span>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Adimlar</h2>
        <OperationTimeline steps={operation.steps} />
      </div>
    </div>
  )
}
