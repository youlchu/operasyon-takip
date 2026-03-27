import { z } from 'zod'

/** Isci olusturma formu Zod semasi */
export const createWorkerSchema = z.object({
  name: z.string().min(1, 'Ad soyad zorunludur').max(100),
  email: z.string().email('Gecerli bir email girin'),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir'),
})

/** Isci guncelleme formu Zod semasi */
export const updateWorkerSchema = z.object({
  name: z.string().min(1, 'Ad soyad zorunludur').max(100).optional(),
  email: z.string().email('Gecerli bir email girin').optional(),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir').optional(),
})

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>
