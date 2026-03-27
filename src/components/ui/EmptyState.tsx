"use client"

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  /** SVG veya emoji ikon */
  icon?: React.ReactNode
  /** Ana baslik */
  title: string
  /** Aciklama metni */
  description?: string
  /** Aksiyon butonu */
  action?: React.ReactNode
  className?: string
}

/**
 * Bos durum bileseni.
 * Veri yokken ikon, baslik, aciklama ve isteğe bagli bir aksiyon gosterir.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
