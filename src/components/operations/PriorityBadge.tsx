"use client"

import { PriorityBadge as Badge } from '@/components/ui/Badge'
import type { Priority } from '@/types'

type PriorityBadgeProps = {
  priority: Priority
  className?: string
}

/**
 * Oncelik rozeti bileseni.
 */
export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return <Badge priority={priority} className={className} />
}
