import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

/**
 * Prisma Client singleton instance.
 * Development ortamında global degisken olarak saklanir
 * boylece hot reload sirasinda birden fazla instance olusturulmaz.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // DATABASE_URL "file:./dev.db" formatinda gelir; "file:" onekini cikartiyoruz
  const rawUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  const relativePath = rawUrl.replace(/^file:/, '')
  const absolutePath = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(process.cwd(), relativePath)

  const adapter = new PrismaBetterSqlite3({ url: absolutePath })

  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
