export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getWorkers } from '@/lib/queries/workers'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import { WorkerDeleteButton } from '@/components/workers/WorkerDeleteButton'

/**
 * Isci listesi sayfasi.
 * Tum iscileri tablo gorunumunde listeler.
 */
export default async function WorkersPage() {
  const workers = await getWorkers()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Isciler</h1>
        <Link
          href="/dashboard/admin/workers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Isci Ekle
        </Link>
      </div>

      {workers.length === 0 ? (
        <EmptyState
          title="Isci bulunamadi"
          description="Henuz sisteme kayitli isci yok."
          action={
            <Link
              href="/dashboard/admin/workers/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Ilk Iscimi Ekle
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ad Soyad
                </th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Kayit Tarihi
                </th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{worker.name}</td>
                  <td className="px-5 py-3 text-gray-500">{worker.email}</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(worker.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/workers/${worker.id}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Duzenle
                      </Link>
                      <WorkerDeleteButton workerId={worker.id} workerName={worker.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
