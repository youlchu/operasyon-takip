import { z } from 'zod'

/** Operasyon olusturma formu Zod semasi */
export const createOperationSchema = z.object({
  title: z.string().min(1, 'Baslik zorunludur').max(200, 'Baslik en fazla 200 karakter olabilir'),
  description: z.string().max(1000, 'Aciklama en fazla 1000 karakter olabilir').optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    error: 'Gecerli bir oncelik secin',
  }),
})

/** Operasyon guncelleme formu Zod semasi */
export const updateOperationSchema = createOperationSchema.partial()

export type CreateOperationInput = z.infer<typeof createOperationSchema>
export type UpdateOperationInput = z.infer<typeof updateOperationSchema>
