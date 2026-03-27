import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers/Providers'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Operasyon Takip Sistemi',
  description: 'Is surecleri ve operasyonlari adim adim takip edin',
}

/**
 * Kok layout — tum sayfalari sarar.
 * Providers ile SessionProvider ve Toaster eklenir.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
