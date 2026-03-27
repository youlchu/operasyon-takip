"use client"

import { cn } from '@/lib/utils'

/** Spinner boyutlari */
type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  /** Boyut varyanti */
  size?: SpinnerSize
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

/**
 * Yukleniyor animasyonu (spin).
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Yukleniyor"
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}
