"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { startOperation, cancelOperation, deleteOperation } from '@/actions/operations'
import type { OperationDTO } from '@/types'

type OperationActionsProps = {
  operation: OperationDTO
}

/**
 * Operasyon aksiyon butonlari: Duzenle, Basla, Iptal, Sil.
 * Duruma gore ilgili butonlar gosterilir.
 */
export function OperationActions({ operation }: OperationActionsProps) {
  const router = useRouter()
  const [startLoading, setStartLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  async function handleStart() {
    setStartLoading(true)
    try {
      const result = await startOperation(operation.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Operasyon baslatildi')
      router.refresh()
    } finally {
      setStartLoading(false)
    }
  }

  async function handleCancel() {
    setCancelLoading(true)
    try {
      const result = await cancelOperation(operation.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Operasyon iptal edildi')
      setShowCancelDialog(false)
      router.refresh()
    } finally {
      setCancelLoading(false)
    }
  }

  async function handleDelete() {
    const result = await deleteOperation(operation.id)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Operasyon silindi')
    router.push('/dashboard/admin/operations')
  }

  return (
    <div className="flex items-center gap-2">
      {/* Draft: duzenle, basla, sil */}
      {operation.status === 'draft' && (
        <>
          <Link href={`/dashboard/admin/operations/${operation.id}/edit`}>
            <Button variant="secondary" size="sm">Duzenle</Button>
          </Link>
          <Button variant="primary" size="sm" loading={startLoading} onClick={handleStart}>
            Basla
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteDialog(true)}>
            Sil
          </Button>
        </>
      )}

      {/* In progress: iptal */}
      {operation.status === 'in_progress' && (
        <Button variant="danger" size="sm" onClick={() => setShowCancelDialog(true)}>
          Iptal Et
        </Button>
      )}

      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Operasyonu Iptal Et"
        description="Bu operasyonu iptal etmek istediginizden emin misiniz? Bu islem geri alinamaz."
        confirmLabel="Iptal Et"
        cancelLabel="Vazgec"
        loading={cancelLoading}
        danger
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Operasyonu Sil"
        description="Bu operasyonu kalici olarak silmek istediginizden emin misiniz?"
        confirmLabel="Sil"
        cancelLabel="Vazgec"
        danger
      />
    </div>
  )
}
