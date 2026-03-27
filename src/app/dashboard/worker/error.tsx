"use client"

export default function WorkerDashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-gray-500 mb-4">Dashboard yuklenirken bir hata olustu.</p>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
        Yeniden Dene
      </button>
    </div>
  )
}
