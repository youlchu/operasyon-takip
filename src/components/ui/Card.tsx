"use client"

import { cn } from '@/lib/utils'

type CardProps = {
  /** Kart baslik alani */
  header?: React.ReactNode
  /** Kart icerik alani */
  body?: React.ReactNode
  /** Kart alt alani */
  footer?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Genel kart bileseni.
 * header, body ve footer slot'larini destekler.
 * children verilirse body slot'u yerine kullanilir.
 */
export function Card({ header, body, footer, className, children }: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {header && (
        <div className="px-5 py-4 border-b border-gray-200">
          {header}
        </div>
      )}
      <div className="px-5 py-4">
        {children ?? body}
      </div>
      {footer && (
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  )
}
