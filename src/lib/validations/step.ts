import { z } from 'zod'

/** Adim olusturma formu Zod semasi */
export const createStepSchema = z.object({
  operationId: z.string().min(1, 'Operasyon zorunludur'),
  title: z.string().min(1, 'Baslik zorunludur').max(200, 'Baslik en fazla 200 karakter olabilir'),
  description: z.string().max(1000).optional(),
  order: z.coerce.number().int().min(1, 'Sira 1\'den buyuk olmalidir'),
  assignedTo: z.string().min(1, 'Isci atamasi zorunludur'),
})

/** Adim guncelleme formu Zod semasi */
export const updateStepSchema = createStepSchema.omit({ operationId: true }).partial()

export type CreateStepInput = z.infer<typeof createStepSchema>
export type UpdateStepInput = z.infer<typeof updateStepSchema>
