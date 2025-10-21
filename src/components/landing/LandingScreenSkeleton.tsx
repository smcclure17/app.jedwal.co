import { Card, CardContent, CardHeader } from '../ui/card'

export function LandingScreenSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
        </CardContent>
      </Card>
    </div>
  )
}
