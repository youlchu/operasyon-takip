"use server"

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createWorkerSchema, updateWorkerSchema } from '@/lib/validations/worker'
import bcrypt from 'bcryptjs'
import type { ActionResult, UserDTO } from '@/types'

/** Admin rol kontrolu yardimci fonksiyonu */
async function requireAdmin() {
  const session = await auth()
  if (!session?.user) return { error: 'Yetkisiz erisim' }
  if ((session.user as { role?: string }).role !== 'admin')
    return { error: 'Sadece yoneticiler bu islemi yapabilir' }
  return { session }
}

/**
 * Yeni isci olusturur. Parola bcrypt ile hashlenir.
 */
export async function createWorker(formData: FormData): Promise<ActionResult<UserDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  const parsed = createWorkerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email: parsed.data.email } })
    if (existingUser) {
      return { success: false, error: 'Bu email adresi zaten kullaniliyor' }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)
    const worker = await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role: 'worker',
      },
    })

    revalidatePath('/dashboard/admin/workers')
    return { success: true, data: worker as unknown as UserDTO }
  } catch {
    return { success: false, error: 'Isci olusturulamadi' }
  }
}

/**
 * Mevcut isciyi gunceller. Yeni parola verilirse bcrypt ile hashlenir.
 */
export async function updateWorker(
  id: string,
  formData: FormData,
): Promise<ActionResult<UserDTO>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  const parsed = updateWorkerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error: 'Gecersiz veri',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const updateData: Record<string, unknown> = {}
    if (parsed.data.name) updateData.name = parsed.data.name
    if (parsed.data.email) updateData.email = parsed.data.email
    if (parsed.data.password) {
      updateData.password = await bcrypt.hash(parsed.data.password, 10)
    }

    const worker = await db.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/dashboard/admin/workers')
    revalidatePath(`/dashboard/admin/workers/${id}/edit`)
    return { success: true, data: worker as unknown as UserDTO }
  } catch {
    return { success: false, error: 'Isci guncellenemedi' }
  }
}

/**
 * Isciye atanmis bekleyen adim yoksa isciyi siler.
 */
export async function deleteWorker(id: string): Promise<ActionResult<void>> {
  const check = await requireAdmin()
  if (check.error) return { success: false, error: check.error }

  try {
    const activeSteps = await db.step.count({
      where: { assignedTo: id, status: { in: ['pending', 'active'] } },
    })
    if (activeSteps > 0) {
      return {
        success: false,
        error: 'Iscinin bekleyen veya aktif adimlari var; once yeniden atama yapin',
      }
    }

    await db.user.delete({ where: { id } })
    revalidatePath('/dashboard/admin/workers')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Isci silinemedi' }
  }
}
