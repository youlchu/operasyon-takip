import { WorkerForm } from '@/components/workers/WorkerForm'

/**
 * Yeni isci ekleme sayfasi.
 */
export default function NewWorkerPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Yeni Isci Ekle</h1>
      <WorkerForm />
    </div>
  )
}
