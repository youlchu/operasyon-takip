export default function OperationDetailLoading() {
  return (
    <div className="max-w-3xl">
      <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-7 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
      <div className="flex gap-2 mb-6">
        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
