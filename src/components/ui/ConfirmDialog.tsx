"use client"

import { Modal } from './Modal'
import { Button } from './Button'

type ConfirmDialogProps = {
  /** Dialog acik mi */
  open: boolean
  /** Kapanma callback'i */
  onClose: () => void
  /** Onay callback'i */
  onConfirm: () => void
  /** Dialog basligi */
  title: string
  /** Aciklama metni */
  description?: string
  /** Onay butonu etiketi */
  confirmLabel?: string
  /** Iptal butonu etiketi */
  cancelLabel?: string
  /** Onay butonu yukleniyor durumu */
  loading?: boolean
  /** Tehlikeli islem mi? Kirmizi buton kullanilir */
  danger?: boolean
}

/**
 * Onay dialogu bileseni.
 * Silme ve iptal gibi geri alinamaz islemler oncesi kullanicidan onay alir.
 * Modal bileseni uzerine kurulmustur.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'Iptal',
  loading = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {description && (
        <p className="text-sm text-gray-600 mb-6">{description}</p>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
