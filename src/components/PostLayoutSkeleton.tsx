import { Separator } from '@radix-ui/react-separator'
import { DashboardSection } from './DashboardSection'

export function PostLayoutSkeleton() {
  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
        <div className="h-7 bg-gray-200 rounded animate-pulse w-64"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-56"></div>
        <Separator />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>

      <DashboardSection title="Content Link">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </DashboardSection>

      <DashboardSection title="Post Slug">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </DashboardSection>

      <DashboardSection title="Categories">
        <div className="h-20 bg-gray-200 rounded animate-pulse w-full"></div>
      </DashboardSection>

      <DashboardSection title="Analytics">
        <div className="h-64 bg-gray-200 rounded animate-pulse w-full"></div>
      </DashboardSection>

      <DashboardSection title="Webhook Integrations">
        <div className="h-32 bg-gray-200 rounded animate-pulse w-full"></div>
      </DashboardSection>

      <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
    </div>
  )
}
