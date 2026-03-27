"use client"

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { OperationStatusBadge } from './OperationStatusBadge'
import { PriorityBadge } from './PriorityBadge'
import type { OperationDTO } from '@/types'

type OperationCardProps = {
  operation: OperationDTO
  className?: string
}

/**
 * Operasyon ozet karti bileseni.
 * Baslik, durum rozeti, oncelik rozeti ve adim ilerleme bilgisini gosterir.
 */
export function OperationCard({ operation, className }: OperationCardProps) {
  const totalSteps = operation.steps.length
  const completedSteps = operation.steps.filter((s) => s.status === 'completed').length
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <Link href={`/dashboard/admin/operations/${operation.id}`}>
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 shadow-sm p-5',
          'hover:border-blue-300 hover:shadow-md transition-all cursor-pointer',
          className
        )}
      >
        {/* Baslik + Rozetler */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
            {operation.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <PriorityBadge priority={operation.priority} />
            <OperationStatusBadge status={operation.status} />
          </div>
        </div>

        {/* Aciklama */}
        {operation.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{operation.description}</p>
        )}

        {/* Ilerleme */}
        {totalSteps > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{completedSteps}/{totalSteps} adim tamamlandi</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {totalSteps === 0 && (
          <p className="text-xs text-gray-400 italic">Henuz adim eklenmemis</p>
        )}
      </div>
    </Link>
  )
}
