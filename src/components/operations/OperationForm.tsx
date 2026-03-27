"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepForm, type StepFormData } from './StepForm'
import { createOperation, updateOperation } from '@/actions/operations'
import { createStep, deleteStep } from '@/actions/steps'
import type { OperationDTO, UserDTO } from '@/types'

const operationFormSchema = z.object({
  title: z.string().min(1, 'Baslik zorunludur').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
})

type OperationFormValues = z.infer<typeof operationFormSchema>

const priorityOptions = [
  { value: 'low', label: 'Dusuk' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yuksek' },
  { value: 'critical', label: 'Kritik' },
]

type OperationFormProps = {
  /** Duzenleme modunda mevcut operasyon */
  operation?: OperationDTO
  /** Isci listesi (adim atamasi icin) */
  workers: UserDTO[]
}

/**
 * Operasyon olusturma/duzenleme formu bileseni.
 * React Hook Form + Zod kulllanir.
 * Adim ekleme arayuzu entegre edilmistir.
 */
export function OperationForm({ operation, workers }: OperationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showStepForm, setShowStepForm] = useState(false)
  const [addingStep, setAddingStep] = useState(false)
  const isEdit = !!operation

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperationFormValues>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: {
      title: operation?.title ?? '',
      description: operation?.description ?? '',
      priority: operation?.priority ?? 'medium',
    },
  })

  async function onSubmit(values: OperationFormValues) {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', values.title)
      if (values.description) fd.append('description', values.description)
      fd.append('priority', values.priority)

      const result = isEdit
        ? await updateOperation(operation.id, fd)
        : await createOperation(fd)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Operasyon guncellendi' : 'Operasyon olusturuldu')
      router.push('/dashboard/admin/operations')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddStep(data: StepFormData) {
    if (!operation) return
    setAddingStep(true)
    try {
      const fd = new FormData()
      fd.append('operationId', operation.id)
      fd.append('title', data.title)
      if (data.description) fd.append('description', data.description)
      fd.append('assignedTo', data.assignedTo)
      fd.append('order', String(operation.steps.length + 1))

      const result = await createStep(fd)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Adim eklendi')
      setShowStepForm(false)
      router.refresh()
    } finally {
      setAddingStep(false)
    }
  }

  async function handleDeleteStep(stepId: string) {
    if (!operation) return
    const result = await deleteStep(stepId)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Adim silindi')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Operasyon bilgileri formu */}
      <Card
        header={
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Operasyonu Duzenle' : 'Yeni Operasyon'}
          </h2>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Operasyon Basligi"
            id="op-title"
            placeholder="Uretim Hatti Operasyonu"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Aciklama (opsiyonel)"
            id="op-description"
            placeholder="Operasyon hakkinda bilgi..."
            {...register('description')}
          />

          <Select
            label="Oncelik"
            id="op-priority"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register('priority')}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard/admin/operations')}
            >
              Iptal
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEdit ? 'Kaydet' : 'Operasyon Olustur'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Adim yonetimi (sadece duzenleme modunda) */}
      {isEdit && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Adimlar ({operation.steps.length})
              </h2>
              {operation.status === 'draft' && !showStepForm && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowStepForm(true)}
                >
                  + Adim Ekle
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-3">
            {operation.steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {step.order}. {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.assignee.name}</p>
                </div>
                {operation.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStep(step.id)}
                    aria-label={`${step.title} adimini sil`}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </Button>
                )}
              </div>
            ))}

            {showStepForm && (
              <div className="pt-2 border-t border-gray-200">
                <StepForm
                  workers={workers}
                  onSubmit={handleAddStep}
                  onCancel={() => setShowStepForm(false)}
                  loading={addingStep}
                />
              </div>
            )}

            {operation.steps.length === 0 && !showStepForm && (
              <p className="text-sm text-gray-500 italic">Henuz adim eklenmemis.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
