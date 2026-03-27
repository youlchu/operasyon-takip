"use client"

import { cn } from '@/lib/utils'
import { StepStatusBadge } from '@/components/ui/Badge'
import type { StepDTO } from '@/types'
import { formatDateTime } from '@/lib/utils'

type StepCardProps = {
  step: StepDTO
  className?: string
}

/**
 * Timeline icindeki tekil adim karti bileseni.
 */
export function StepCard({ step, className }: StepCardProps) {
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 border-gray-200',
    active: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
  }

  const numberColors: Record<string, string> = {
    pending: 'bg-gray-200 text-gray-600',
    active: 'bg-blue-500 text-white',
    completed: 'bg-green-500 text-white',
  }

  return (
    <div
      className={cn(
        'flex gap-4 rounded-lg border p-4',
        statusColors[step.status],
        className
      )}
    >
      {/* Sira numarasi */}
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0',
          numberColors[step.status]
        )}
      >
        {step.status === 'completed' ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          step.order
        )}
      </div>

      {/* Icerik */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">{step.title}</p>
          <StepStatusBadge status={step.status} />
        </div>

        {step.description && (
          <p className="text-xs text-gray-500 mb-2">{step.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            <span className="font-medium">Atanan:</span> {step.assignee.name}
          </span>
          {step.completedAt && (
            <span>
              <span className="font-medium">Tamamlandi:</span>{' '}
              {formatDateTime(step.completedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
