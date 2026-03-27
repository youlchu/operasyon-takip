export default function WorkerHistoryLoading() {
  return (
    <div>
      <div className="h-7 w-24 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="flex flex-col gap-3 max-w-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-3 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
