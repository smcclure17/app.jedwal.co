export function WelcomeBannerSkeleton() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8 ml-4">
        <div className="flex items-center gap- mb-2">
          <div className="h-12 w-12 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
        </div>
        <div className="h-7 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>
    </div>
  )
}
