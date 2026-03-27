import { cache } from 'react'
import { db } from '@/lib/db'
import type { UserDTO } from '@/types'

/**
 * Tum iscileri getirir (role = 'worker').
 */
export const getWorkers = cache(async (): Promise<UserDTO[]> => {
  const workers = await db.user.findMany({
    where: { role: 'worker' },
    orderBy: { name: 'asc' },
  })

  return workers as unknown as UserDTO[]
})

/**
 * Belirli bir kullanicıyi id ile getirir.
 */
export const getWorkerById = cache(async (id: string): Promise<UserDTO | null> => {
  const worker = await db.user.findUnique({ where: { id } })
  return worker as unknown as UserDTO | null
})
