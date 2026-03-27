"use server"

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createOperationSchema, updateOperationSchema } from '@/lib/validations/operation'
import type { ActionResult, OperationDTO } from '@/types'

/** Auth + admin rol kontrolu yardimci fonksiyonu */
async function requireAdmin() {
  const session = await auth()
  if (!session?.user) return { error: 'Yetkisiz erisim' }
  if ((session.user as { role?: string }).role !== 'admin')
    return { error: 'Sadece yoneticiler bu islemi yapabilir' }
  return { session }
}

/**
 * Yeni operasyon olusturur.
 */
export async function createOperation(formData: FormData): Promise<ActionResult<OperationDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }
  const session = check.session!

  const parsed = createOperationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const operation = await db.operation.create({
      data: {
        ...parsed.data,
        createdBy: (session.user as { id: string }).id,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        steps: { orderBy: { order: 'asc' }, include: { assignee: { select: { id: true, name: true, email: true } } } },
      },
    })
    revalidatePath('/dashboard/admin/operations')
    revalidatePath('/dashboard/admin')
    return { success: true, data: operation as unknown as OperationDTO }
  } catch {
    return { success: false, error: 'Operasyon olusturulamadi' }
  }
}

/**
 * Mevcut operasyonu gunceller (yalnizca draft durumunda).
 */
export async function updateOperation(
  id: string,
  formData: FormData,
): Promise<ActionResult<OperationDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  const parsed = updateOperationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const operation = await db.operation.update({
      where: { id },
      data: parsed.data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        steps: { orderBy: { order: 'asc' }, include: { assignee: { select: { id: true, name: true, email: true } } } },
      },
    })
    revalidatePath('/dashboard/admin/operations')
    revalidatePath(`/dashboard/admin/operations/${id}`)
    return { success: true, data: operation as unknown as OperationDTO }
  } catch {
    return { success: false, error: 'Operasyon guncellenemedi' }
  }
}

/**
 * Operasyonu siler (yalnizca draft durumunda).
 */
export async function deleteOperation(id: string): Promise<ActionResult<void>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  try {
    const operation = await db.operation.findUnique({ where: { id } })
    if (!operation) return { success: false, error: 'Operasyon bulunamadi' }
    if (operation.status !== 'draft') {
      return { success: false, error: 'Yalnizca taslak operasyonlar silinebilir' }
    }

    await db.operation.delete({ where: { id } })
    revalidatePath('/dashboard/admin/operations')
    revalidatePath('/dashboard/admin')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Operasyon silinemedi' }
  }
}

/**
 * Operasyonu baslatir: status -> in_progress, ilk adim -> active.
 */
export async function startOperation(id: string): Promise<ActionResult<void>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  try {
    const operation = await db.operation.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: 'asc' } } },
    })
    if (!operation) return { success: false, error: 'Operasyon bulunamadi' }
    if (operation.status !== 'draft') {
      return { success: false, error: 'Yalnizca taslak operasyonlar baslatilabilir' }
    }
    if (operation.steps.length === 0) {
      return { success: false, error: 'Operasyona en az bir adim ekleyin' }
    }

    const firstStep = operation.steps[0]
    await db.$transaction([
      db.operation.update({ where: { id }, data: { status: 'in_progress' } }),
      db.step.update({ where: { id: firstStep.id }, data: { status: 'active' } }),
    ])

    revalidatePath('/dashboard/admin/operations')
    revalidatePath(`/dashboard/admin/operations/${id}`)
    revalidatePath('/dashboard/worker')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Operasyon baslatılamadı' }
  }
}

/**
 * Operasyonu iptal eder.
 */
export async function cancelOperation(id: string): Promise<ActionResult<void>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  try {
    const operation = await db.operation.findUnique({ where: { id } })
    if (!operation) return { success: false, error: 'Operasyon bulunamadi' }
    if (operation.status === 'completed' || operation.status === 'cancelled') {
      return { success: false, error: 'Bu operasyon zaten sonlandirilmis' }
    }

    await db.operation.update({ where: { id }, data: { status: 'cancelled' } })
    revalidatePath('/dashboard/admin/operations')
    revalidatePath(`/dashboard/admin/operations/${id}`)
    revalidatePath('/dashboard/admin')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Operasyon iptal edilemedi' }
  }
}
