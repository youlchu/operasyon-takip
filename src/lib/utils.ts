import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS siniflarini kosullu olarak birlestiren yardimci fonksiyon.
 * clsx + tailwind-merge kombinasyonu kullanir.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Tarihi 'GG.AA.YYYY' formatinda dondurur.
 * @example formatDate(new Date('2024-03-15')) => '15.03.2024'
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Tarihi ve saati 'GG.AA.YYYY HH:MM' formatinda dondurur.
 * @example formatDateTime(new Date('2024-03-15T14:30:00')) => '15.03.2024 14:30'
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
