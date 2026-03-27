"use client"

import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Form alani etiketi */
  label?: string
  /** Hata mesaji — varsa kirmizi renkte gosterilir */
  error?: string
}

/**
 * Form input bileseni.
 * label ve error mesaji destekler; id-htmlFor eslesmesi zorunludur.
 */
export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={cn(
          'rounded-md border px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-300',
          className
        )}
      />
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
