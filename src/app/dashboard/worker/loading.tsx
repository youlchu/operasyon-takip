export default function WorkerDashboardLoading() {
  return (
    <div>
      <div className="h-7 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="h-4 w-24 bg-gray-200 rounded-full mb-3 animate-pulse" />
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded mb-4 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
