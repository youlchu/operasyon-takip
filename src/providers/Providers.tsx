"use client"

import { Toaster } from 'react-hot-toast'
import { SessionProvider } from './SessionProvider'

/**
 * Tum provider'lari saran kok wrapper bileseni.
 * Root layout'ta <Providers>{children}</Providers> seklinde kullanilir.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </SessionProvider>
  )
}
