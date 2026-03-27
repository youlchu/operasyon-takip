import type { OperationStatus, Priority, StepStatus } from '@/types'

/** Oncelik seviyesi renk sinifları (Tailwind) */
export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
} satisfies Record<Priority, string>

/** Oncelik seviyesi Turkce etiketleri */
export const PRIORITY_LABELS = {
  low: 'Dusuk',
  medium: 'Orta',
  high: 'Yuksek',
  critical: 'Kritik',
} satisfies Record<Priority, string>

/** Operasyon durum renk sinifları (Tailwind) */
export const OPERATION_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
} satisfies Record<OperationStatus, string>

/** Operasyon durum Turkce etiketleri */
export const OPERATION_STATUS_LABELS = {
  draft: 'Taslak',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandi',
  cancelled: 'Iptal Edildi',
} satisfies Record<OperationStatus, string>

/** Adim durum renk sinifları (Tailwind) */
export const STEP_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-500',
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
} satisfies Record<StepStatus, string>

/** Adim durum Turkce etiketleri */
export const STEP_STATUS_LABELS = {
  pending: 'Bekliyor',
  active: 'Aktif',
  completed: 'Tamamlandi',
} satisfies Record<StepStatus, string>
