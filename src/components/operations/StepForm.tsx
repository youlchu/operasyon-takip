"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { UserDTO } from '@/types'

const stepFormSchema = z.object({
  title: z.string().min(1, 'Baslik zorunludur'),
  description: z.string().optional(),
  assignedTo: z.string().min(1, 'Isci secimi zorunludur'),
})

type StepFormValues = z.infer<typeof stepFormSchema>

export type StepFormData = {
  title: string
  description?: string
  assignedTo: string
}

type StepFormProps = {
  /** Secim icin isci listesi */
  workers: Pick<UserDTO, 'id' | 'name' | 'email'>[]
  /** Varsayilan degerler (duzenleme modunda) */
  defaultValues?: Partial<StepFormValues>
  /** Form submit callback'i */
  onSubmit: (data: StepFormData) => void
  /** Iptal callback'i */
  onCancel?: () => void
  /** Yukleniyor durumu */
  loading?: boolean
  /** Submit butonu etiketi */
  submitLabel?: string
}

/**
 * Adim ekleme/duzenleme formu bileseni.
 * Baslık, acıklama ve isci secimi alır.
 */
export function StepForm({
  workers,
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Adim Ekle',
}: StepFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFormValues>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: defaultValues ?? {},
  })

  const workerOptions = workers.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.email})`,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Adim Basligi"
        id="step-title"
        placeholder="Hammadde Kesim"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Aciklama (opsiyonel)"
        id="step-description"
        placeholder="Adim hakkinda kisa aciklama..."
        {...register('description')}
      />

      <Select
        label="Atanan Isci"
        id="step-assigned-to"
        options={workerOptions}
        placeholder="Isci secin"
        error={errors.assignedTo?.message}
        {...register('assignedTo')}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Iptal
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
