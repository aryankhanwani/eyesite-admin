export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 sm:h-8 md:h-9 w-64 sm:w-80 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 sm:h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Form Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 h-11 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full sm:w-32 h-11 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

