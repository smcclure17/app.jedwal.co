import { Spinner } from "../Spinner";

export function ApisLayoutSkeleton() {
  return (
    <div className="flex flex-col space-y-12 mr-12 pt-10 pl-4">
      {/* Create API Form Skeleton */}
      <div className="flex flex-col space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mb-4"></div>
        <div className="flex flex-row space-x-2">
          <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>

      {/* APIs List & Content Skeleton */}
      <div className="flex space-x-8">
        {/* List Skeleton */}
        <div className="max-w-sm w-72">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
          <div className="overflow-hidden">
            <div className="divide-y divide-gray-200 border-t">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="py-3 px-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-0.25 bg-gray-300" />

        {/* Content Area Skeleton */}
        <div className="flex flex-1 items-center justify-center text-gray-500">
          <Spinner srText="loading"/>
        </div>
      </div>
    </div>
  )
}
