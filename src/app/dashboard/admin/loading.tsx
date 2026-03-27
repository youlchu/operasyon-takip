/**
 * Admin dashboard loading skeleton
 */
export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="h-7 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-4 w-28 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
