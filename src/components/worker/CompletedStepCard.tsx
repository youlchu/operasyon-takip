import { formatDateTime } from '@/lib/utils'
import type { StepDTO } from '@/types'

type CompletedStepCardProps = {
  step: StepDTO
}

/**
 * Tamamlanmis adim karti bileseni.
 * Gecmis sayfasinda kullanilir; tamamlanma tarihi, operasyon adi ve adim adini gosterir.
 */
export function CompletedStepCard({ step }: CompletedStepCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Operasyon adı */}
          <p className="text-xs text-gray-500 mb-0.5">{step.operation.title}</p>

          {/* Adim adı */}
          <p className="text-sm font-semibold text-gray-900">{step.title}</p>

          {step.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{step.description}</p>
          )}
        </div>

        {/* Tamamlanma tarihi */}
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Tamamlandi
          </span>
          <p className="text-xs text-gray-400 mt-1">{formatDateTime(step.completedAt)}</p>
        </div>
      </div>
    </div>
  )
}
