"use client"

import { cn } from '@/lib/utils'
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  OPERATION_STATUS_COLORS,
  OPERATION_STATUS_LABELS,
  STEP_STATUS_COLORS,
  STEP_STATUS_LABELS,
} from '@/constants'
import type { Priority, OperationStatus, StepStatus } from '@/types'

type BadgeProps = {
  className?: string
  children: React.ReactNode
  variant?: string
}

/**
 * Temel rozet bileseni.
 */
function BadgeBase({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}

type PriorityBadgeProps = { priority: Priority; className?: string }

/**
 * Oncelik rozeti — Priority tipini kullanir.
 */
export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <BadgeBase className={cn(PRIORITY_COLORS[priority], className)}>
      {PRIORITY_LABELS[priority]}
    </BadgeBase>
  )
}

type OperationStatusBadgeProps = { status: OperationStatus; className?: string }

/**
 * Operasyon durum rozeti — OperationStatus tipini kullanir.
 */
export function OperationStatusBadge({ status, className }: OperationStatusBadgeProps) {
  return (
    <BadgeBase className={cn(OPERATION_STATUS_COLORS[status], className)}>
      {OPERATION_STATUS_LABELS[status]}
    </BadgeBase>
  )
}

type StepStatusBadgeProps = { status: StepStatus; className?: string }

/**
 * Adim durum rozeti — StepStatus tipini kullanir.
 */
export function StepStatusBadge({ status, className }: StepStatusBadgeProps) {
  return (
    <BadgeBase className={cn(STEP_STATUS_COLORS[status], className)}>
      {STEP_STATUS_LABELS[status]}
    </BadgeBase>
  )
}
