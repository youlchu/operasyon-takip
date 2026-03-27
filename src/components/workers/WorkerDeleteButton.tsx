"use client"

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { deleteWorker } from '@/actions/workers'

type WorkerDeleteButtonProps = {
  workerId: string
  workerName: string
}

/**
 * Isci silme butonu + onay dialogu.
 */
export function WorkerDeleteButton({ workerId, workerName }: WorkerDeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const result = await deleteWorker(workerId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Isci silindi')
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-red-500 hover:text-red-700 font-medium"
        aria-label={`${workerName} isimli isciiyi sil`}
      >
        Sil
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Iscisi Sil"
        description={`"${workerName}" isimli isciy silmek istediginizden emin misiniz?`}
        confirmLabel="Sil"
        cancelLabel="Vazgec"
        loading={loading}
        danger
      />
    </>
  )
}
