"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Isci dashboard otomatik yenileme bileseni.
 * Her 30 saniyede bir ve sekme odagi geri geldiginde sayfayi yeniler.
 * Yeni aktif adimlar aninda gorulur.
 */
export function WorkerDashboardRefresher() {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 30_000)

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        router.refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  return null
}
