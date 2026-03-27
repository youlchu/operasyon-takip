/**
 * Gelistirme ortami icin ornek veri (seed data).
 * Calistirmak icin: npx prisma db seed
 */
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seed verisi yukleniyor...')

  // Mevcut verileri temizle
  await prisma.step.deleteMany()
  await prisma.operation.deleteMany()
  await prisma.user.deleteMany()

  // --- Kullanicilar ---
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Kullanici',
      email: 'admin@example.com',
      role: 'admin',
      password: hashedPassword,
    },
  })

  const worker1 = await prisma.user.create({
    data: {
      name: 'Ahmet Yilmaz',
      email: 'ahmet@example.com',
      role: 'worker',
      password: hashedPassword,
    },
  })

  const worker2 = await prisma.user.create({
    data: {
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      role: 'worker',
      password: hashedPassword,
    },
  })

  const worker3 = await prisma.user.create({
    data: {
      name: 'Ayse Demir',
      email: 'ayse@example.com',
      role: 'worker',
      password: hashedPassword,
    },
  })

  console.log(`4 kullanici olusturuldu: admin, ${worker1.name}, ${worker2.name}, ${worker3.name}`)

  // --- Operasyon 1: Uretim Hatti ---
  const op1 = await prisma.operation.create({
    data: {
      title: 'Urun Uretim Hatti',
      description: 'Hammadde aliminden bitirmis urune kadar tam uretim sureci',
      priority: 'high',
      status: 'in_progress',
      createdBy: admin.id,
    },
  })

  await prisma.step.createMany({
    data: [
      {
        operationId: op1.id,
        title: 'Hammadde Kesim',
        description: 'Hammaddenin belirlenen olculerde kesilmesi',
        order: 1,
        status: 'completed',
        assignedTo: worker1.id,
        completedAt: new Date(),
        completedBy: worker1.id,
      },
      {
        operationId: op1.id,
        title: 'Montaj',
        description: 'Kesilen parcalarin birlestirilmesi',
        order: 2,
        status: 'active',
        assignedTo: worker2.id,
      },
      {
        operationId: op1.id,
        title: 'Kalite Kontrol',
        description: 'Urununun kalite standartlarina uygunlugunu dogrulama',
        order: 3,
        status: 'pending',
        assignedTo: worker3.id,
      },
      {
        operationId: op1.id,
        title: 'Paketleme',
        description: 'Onaylanan urununun paketlenmesi',
        order: 4,
        status: 'pending',
        assignedTo: worker1.id,
      },
    ],
  })

  // --- Operasyon 2: Musterisiparis Akisi (Taslak) ---
  const op2 = await prisma.operation.create({
    data: {
      title: 'Musteri Siparis Akisi',
      description: 'Siparis aliminden teslimata kadar musteri siparis sureci',
      priority: 'critical',
      status: 'draft',
      createdBy: admin.id,
    },
  })

  await prisma.step.createMany({
    data: [
      {
        operationId: op2.id,
        title: 'Siparis Dogrulama',
        description: 'Musteri siparis bilgilerinin dogrulanmasi',
        order: 1,
        status: 'pending',
        assignedTo: worker2.id,
      },
      {
        operationId: op2.id,
        title: 'Stok Kontrolu',
        description: 'Siparis edilen urunlerin stokta kontrolu',
        order: 2,
        status: 'pending',
        assignedTo: worker3.id,
      },
      {
        operationId: op2.id,
        title: 'Kargo Hazirlama',
        description: 'Urunlerin kargo icin paketlenmesi ve etiketlenmesi',
        order: 3,
        status: 'pending',
        assignedTo: worker1.id,
      },
    ],
  })

  console.log('2 operasyon ve 7 adim olusturuldu')
  console.log('\nGiris bilgileri:')
  console.log('  Admin    -> admin@example.com / password123')
  console.log('  Isci 1   -> ahmet@example.com / password123')
  console.log('  Isci 2   -> mehmet@example.com / password123')
  console.log('  Isci 3   -> ayse@example.com / password123')
}

main()
  .catch((e) => {
    console.error('Seed hatasi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
