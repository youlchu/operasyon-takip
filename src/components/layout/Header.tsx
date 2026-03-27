"use client"

import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/types'

type HeaderProps = {
  user: SessionUser
}

const roleLabels: Record<string, string> = {
  admin: 'Yonetici',
  worker: 'Isci',
}

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  worker: 'bg-blue-100 text-blue-700',
}

/**
 * Dashboard ust bar bileseni.
 * Kullanici adi, rol rozeti ve cikis butonunu gosterir.
 */
export function Header({ user }: HeaderProps) {
  async function handleSignOut() {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />

      <div className="flex items-center gap-4">
        {/* Rol rozeti */}
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium',
            roleBadgeColors[user.role] ?? 'bg-gray-100 text-gray-700'
          )}
        >
          {roleLabels[user.role] ?? user.role}
        </span>

        {/* Kullanici adi */}
        <span className="text-sm font-medium text-gray-700">{user.name}</span>

        {/* Cikis butonu */}
        <button
          onClick={handleSignOut}
          aria-label="Cikis yap"
          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cikis
        </button>
      </div>
    </header>
  )
}
