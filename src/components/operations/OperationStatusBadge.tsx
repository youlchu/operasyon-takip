"use client"

import { OperationStatusBadge as Badge } from '@/components/ui/Badge'
import type { OperationStatus } from '@/types'

type OperationStatusBadgeProps = {
  status: OperationStatus
  className?: string
}

/**
 * Operasyon durum rozeti bileseni.
 */
export function OperationStatusBadge({ status, className }: OperationStatusBadgeProps) {
  return <Badge status={status} className={className} />
}
