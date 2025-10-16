import { useApiAnalytics } from '@/hooks/use-apis'
import { AnalyticsChartInternals } from '../AnalyticsChartInternals'

export interface PostAnalyticsChartProps {
  accountId: string
  postId: string
}

export function PostAnalyticsChart({
  accountId,
  postId,
}: PostAnalyticsChartProps) {
  const { data: analyticRows, isLoading } = useApiAnalytics(accountId, postId)

  if (isLoading || analyticRows === null) return <></>
  return (
    // TODO: this chart is very hard-coded. fix that
    <div className="rounded-md border w-[510px] bg-gray-50 text-gray-600 text-sm w-full max-w-xl">
      <p className="px-4 py-2">API Traffic over the last 7 days</p>
      <AnalyticsChartInternals data={analyticRows} />
    </div>
  )
}
