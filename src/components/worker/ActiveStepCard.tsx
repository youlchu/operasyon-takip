"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { PriorityBadge } from '@/components/operations/PriorityBadge'
import { completeStep } from '@/actions/steps'
import type { StepDTO } from '@/types'

type ActiveStepCardProps = {
  step: StepDTO
}

/**
 * Isci ekranindaki aktif adim karti bileseni.
 * Buyuk, dikkat cekici kart: operasyon adi, adim adi, aciklama, oncelik rozeti.
 * "Adimi Tamamla" butonu ile is akisi ilerletilir.
 */
export function ActiveStepCard({ step }: ActiveStepCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    try {
      const result = await completeStep(step.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Adim tamamlandi!')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-md p-6 hover:border-blue-400 transition-colors">
      {/* Operasyon bilgisi */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
          {step.operation.title}
        </span>
        <PriorityBadge priority={step.operation.priority} />
      </div>

      {/* Adim baslik */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>

      {/* Aciklama */}
      {step.description && (
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>
      )}

      {/* Adim sirasi */}
      <p className="text-xs text-gray-400 mb-4">Adim {step.order}</p>

      {/* Tamamla butonu */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
        onClick={handleComplete}
      >
        Adimi Tamamla
      </Button>
    </div>
  )
}
