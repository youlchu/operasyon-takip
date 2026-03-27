"use server"

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createStepSchema, updateStepSchema } from '@/lib/validations/step'
import type { ActionResult, StepDTO } from '@/types'

/** Kimlik dogrulama yardimci fonksiyonu */
async function requireAuth() {
  const session = await auth()
  if (!session?.user) return { error: 'Yetkisiz erisim' }
  return { session }
}

/** Admin rol kontrolu yardimci fonksiyonu */
async function requireAdmin() {
  const check = await requireAuth()
  if (check.error) return { error: check.error }
  if ((check.session!.user as { role?: string }).role !== 'admin')
    return { error: 'Sadece yoneticiler bu islemi yapabilir' }
  return { session: check.session! }
}

/**
 * Operasyona yeni adim ekler.
 */
export async function createStep(formData: FormData): Promise<ActionResult<StepDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  const parsed = createStepSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const step = await db.step.create({
      data: parsed.data,
      include: { assignee: { select: { id: true, name: true, email: true } } },
    })
    revalidatePath(`/dashboard/admin/operations/${parsed.data.operationId}`)
    return { success: true, data: step as unknown as StepDTO }
  } catch {
    return { success: false, error: 'Adim olusturulamadi' }
  }
}

/**
 * Mevcut adimi gunceller.
 */
export async function updateStep(
  id: string,
  formData: FormData,
): Promise<ActionResult<StepDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  const parsed = updateStepSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const step = await db.step.update({
      where: { id },
      data: parsed.data,
      include: { assignee: { select: { id: true, name: true, email: true } } },
    })
    revalidatePath(`/dashboard/admin/operations/${step.operationId}`)
    return { success: true, data: step as unknown as StepDTO }
  } catch {
    return { success: false, error: 'Adim guncellenemedi' }
  }
}

/**
 * Adimi siler.
 */
export async function deleteStep(id: string): Promise<ActionResult<void>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  try {
    const step = await db.step.findUnique({ where: { id } })
    if (!step) return { success: false, error: 'Adim bulunamadi' }

    await db.step.delete({ where: { id } })
    revalidatePath(`/dashboard/admin/operations/${step.operationId}`)
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Adim silinemedi' }
  }
}

/**
 * Adimi tamamlar ve is akisini ilerletir.
 *
 * - Mevcut adim -> 'completed'
 * - Siradaki adim varsa -> 'active' (atanan iscinin ekranina duser)
 * - Son adimsa -> operasyon 'completed' olur
 *
 * Tum islemler tek bir transaction icinde yapilir.
 */
export async function completeStep(stepId: string): Promise<ActionResult<void>> {
  const check = await requireAuth()
  if (check.error) return { success: false, error: check.error }
  const userId = (check.session!.user as { id: string }).id

  try {
    // IDOR kontrolu: yalnizca atanan isci kendi adimini tamamlayabilir
    const step = await db.step.findUnique({
      where: { id: stepId, assignedTo: userId, status: 'active' },
      include: {
        operation: {
          include: { steps: { orderBy: { order: 'asc' } } },
        },
      },
    })

    if (!step) {
      return { success: false, error: 'Adim bulunamadi veya tamamlamaya yetkiniz yok' }
    }

    const allSteps = step.operation.steps
    const nextStep = allSteps.find((s: { order: number }) => s.order === step.order + 1)
    const isLastStep = !nextStep

    await db.$transaction(async (tx) => {
      // 1. Mevcut adimi tamamla
      await tx.step.update({
        where: { id: stepId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          completedBy: userId,
        },
      })
      // 2. Bir sonraki adimi aktifles VEYA operasyonu tamamla
      if (isLastStep) {
        await tx.operation.update({
          where: { id: step.operationId },
          data: { status: 'completed' },
        })
      } else {
        await tx.step.update({
          where: { id: nextStep!.id },
          data: { status: 'active' },
        })
      }
    })

    revalidatePath('/dashboard/worker')
    revalidatePath('/dashboard/worker/history')
    revalidatePath(`/dashboard/admin/operations/${step.operationId}`)
    revalidatePath('/dashboard/admin')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Adim tamamlanamadi' }
  }
}
