"use client"

import { StepCard } from './StepCard'
import type { StepDTO } from '@/types'

type OperationTimelineProps = {
  steps: StepDTO[]
}

/**
 * Operasyon adim timeline bileseni.
 * Adimlari sirali olarak listeler.
 */
export function OperationTimeline({ steps }: OperationTimelineProps) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">Bu operasyona henuz adim eklenmemis.</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step) => (
        <StepCard key={step.id} step={step} />
      ))}
    </div>
  )
}
