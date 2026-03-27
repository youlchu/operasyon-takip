export const dynamic = 'force-dynamic'

import { getAdminStats } from '@/lib/queries/operations'

/**
 * Admin ana dashboard sayfasi.
 * Toplam/aktif/tamamlanan operasyon ve isci sayisi istatistiklerini gosterir.
 */
export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: 'Toplam Operasyon',
      value: stats.totalOperations,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Aktif Operasyon',
      value: stats.activeOperations,
      color: 'bg-yellow-50 text-yellow-700',
      iconColor: 'text-yellow-400',
    },
    {
      label: 'Tamamlanan',
      value: stats.completedOperations,
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-400',
    },
    {
      label: 'Toplam Isci',
      value: stats.totalWorkers,
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-400',
    },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm`}
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
