import { cache } from 'react'
import { db } from '@/lib/db'
import type { OperationDTO, AdminStats } from '@/types'

/**
 * Tum operasyonlari adimlar ve olusturucu bilgisiyle birlikte getirir.
 */
export const getOperations = cache(async (): Promise<OperationDTO[]> => {
  const operations = await db.operation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      steps: {
        orderBy: { order: 'asc' },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  return operations as unknown as OperationDTO[]
})

/**
 * Belirli bir operasyonu id ile getirir.
 * Adimlar siraya gore siralanir, her adimda atanan isci bilgisi eklenir.
 */
export const getOperationById = cache(async (id: string): Promise<OperationDTO | null> => {
  const operation = await db.operation.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      steps: {
        orderBy: { order: 'asc' },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  return operation as unknown as OperationDTO | null
})

/**
 * Admin dashboard istatistiklerini getirir.
 */
export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const [totalOperations, activeOperations, completedOperations, totalWorkers] =
    await Promise.all([
      db.operation.count(),
      db.operation.count({ where: { status: 'in_progress' } }),
      db.operation.count({ where: { status: 'completed' } }),
      db.user.count({ where: { role: 'worker' } }),
    ])

  return { totalOperations, activeOperations, completedOperations, totalWorkers }
})
