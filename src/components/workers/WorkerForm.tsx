"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createWorker, updateWorker } from '@/actions/workers'
import type { UserDTO } from '@/types'

const createSchema = z.object({
  name: z.string().min(1, 'Ad soyad zorunludur'),
  email: z.string().email('Gecerli bir email girin'),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir'),
})

const updateSchema = z.object({
  name: z.string().min(1, 'Ad soyad zorunludur').optional(),
  email: z.string().email('Gecerli bir email girin').optional(),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir').optional().or(z.literal('')),
})

type CreateFormValues = z.infer<typeof createSchema>
type UpdateFormValues = z.infer<typeof updateSchema>

type WorkerFormProps = {
  /** Duzenleme modunda mevcut isci */
  worker?: UserDTO
}

/**
 * Isci olusturma/duzenleme formu.
 */
export function WorkerForm({ worker }: WorkerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!worker

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormValues | UpdateFormValues>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema) as never,
    defaultValues: worker
      ? { name: worker.name, email: worker.email, password: '' }
      : {},
  })

  async function onSubmit(values: CreateFormValues | UpdateFormValues) {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val) fd.append(key, val as string)
      })

      const result = isEdit
        ? await updateWorker(worker.id, fd)
        : await createWorker(fd)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Isci guncellendi' : 'Isci olusturuldu')
      router.push('/dashboard/admin/workers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit as never)} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <Input
          label="Ad Soyad"
          id="worker-name"
          placeholder="Ahmet Yilmaz"
          error={(errors as Record<string, { message?: string }>).name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          id="worker-email"
          placeholder="ahmet@sirket.com"
          error={(errors as Record<string, { message?: string }>).email?.message}
          {...register('email')}
        />

        <Input
          label={isEdit ? 'Yeni Sifre (bos birakabilirsiniz)' : 'Sifre'}
          type="password"
          id="worker-password"
          placeholder="••••••••"
          error={(errors as Record<string, { message?: string }>).password?.message}
          {...register('password')}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/admin/workers')}
          >
            Iptal
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Kaydet' : 'Isci Ekle'}
          </Button>
        </div>
      </form>
    </div>
  )
}
