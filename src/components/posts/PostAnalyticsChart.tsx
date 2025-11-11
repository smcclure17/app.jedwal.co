import { AnalyticsChartInternals } from '../AnalyticsChartInternals'
import { useAnalytics } from '@/hooks/use-apis'

export interface PostAnalyticsChartProps {
  accountId: string
  resourceType: 'api' | 'post'
  postId: string
}

export function AnalyticsChart({
  accountId,
  resourceType,
  postId,
}: PostAnalyticsChartProps) {
  const { data: analyticRows, isLoading } = useAnalytics(accountId, resourceType, postId)

  if (isLoading || analyticRows === undefined) return <></>
  return (
    // TODO: this chart is very hard-coded. fix that
    <div className="rounded-md border w-[510px] bg-gray-50 text-gray-600 text-sm w-full max-w-xl">
      <p className="px-4 py-2">API Traffic over the last 7 days</p>
      <AnalyticsChartInternals data={analyticRows} />
    </div>
  )
}
