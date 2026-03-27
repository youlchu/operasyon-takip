"use client"

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type ModalProps = {
  /** Modal acik mi */
  open: boolean
  /** Kapanma callback'i — ESC veya overlay tiklamasinda tetiklenir */
  onClose: () => void
  /** Modal basligi */
  title: string
  /** Modal icerigi */
  children: React.ReactNode
  className?: string
}

/**
 * Erisebilir modal/dialog bileseni.
 * ESC ile kapanir, ilk interaktif elemana focus atar, overlay tiklamasinda kapanir.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`

  /* ESC ile kapanma */
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  /* Modal acilinca ilk odaklanabilir elemana git */
  useEffect(() => {
    if (!open) return
    const focusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  }, [open])

  /* Scroll kilidi */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog kutusu */}
      <div
        ref={dialogRef}
        className={cn(
          'relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md mx-4',
          'max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {/* Baslik */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Modali kapat"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Icerik */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
