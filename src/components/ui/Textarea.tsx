"use client"

import { cn } from '@/lib/utils'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Form alani etiketi */
  label?: string
  /** Hata mesaji */
  error?: string
}

/**
 * Form textarea bileseni.
 * label ve error mesaji destekler.
 */
export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        id={textareaId}
        rows={props.rows ?? 3}
        className={cn(
          'rounded-md border px-3 py-2 text-sm text-gray-900 resize-none',
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
