import { cache } from 'react'
import { db } from '@/lib/db'
import type { StepDTO } from '@/types'

/**
 * Belirli bir isciye atanmis aktif adimlari getirir.
 * IDOR korumali: yalnizca assignedTo = userId sorgusu yapilir.
 */
export const getActiveStepsByWorker = cache(async (userId: string): Promise<StepDTO[]> => {
  const steps = await db.step.findMany({
    where: {
      assignedTo: userId,
      status: 'active',
    },
    orderBy: { createdAt: 'asc' },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      operation: {
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          description: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          creator: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  return steps as unknown as StepDTO[]
})

/**
 * Belirli bir iscinin tamamladigi adimlari getirir.
 * IDOR korumali: yalnizca completedBy = userId sorgusu yapilir.
 */
export const getCompletedStepsByWorker = cache(async (userId: string): Promise<StepDTO[]> => {
  const steps = await db.step.findMany({
    where: {
      completedBy: userId,
      status: 'completed',
    },
    orderBy: { completedAt: 'desc' },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      operation: {
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          description: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          creator: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  return steps as unknown as StepDTO[]
})
