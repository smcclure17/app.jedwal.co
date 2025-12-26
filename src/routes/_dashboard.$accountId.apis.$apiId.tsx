// src/routes/_dashboard.$accountId.posts.$postId.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetchApis } from '@/data/fetchers/apis'
import config from '@/config'
import { Separator } from '@/components/ui/separator'
import { DashboardSection } from '@/components/DashboardSection'
import { AnalyticsChart } from '@/components/posts/PostAnalyticsChart'
import { PostLayoutSkeleton } from '@/components/posts/PostLayoutSkeleton'
import { DeleteApiButton } from '@/components/apis/DeleteApiButton'
import { ApiCopyableSnippet } from '@/components/apis/ApiCopyableSnippet'
import { CacheInput } from '@/components/apis/ApiUpdateCadence'
import { ApiWatchChannels } from '@/components/apis/ApiWatchChannels'

export const Route = createFileRoute('/_dashboard/$accountId/apis/$apiId')({
  head: ({ params }) => ({
    meta: [{ title: `Jedwal -- ${params.apiId}` }],
  }),
  component: PostLayout,
})

function PostLayout() {
  const { accountId, apiId } = Route.useParams()
  const { data: posts, isLoading } = useQuery({
    queryKey: ['apis', accountId],
    queryFn: () => fetchApis(accountId),
    initialData: [],
  })

  const post = posts.find((p) => p.api_key === apiId)

  if (isLoading || !post) {
    return <PostLayoutSkeleton />
  }

  const postSourceUrl = `https://docs.google.com/spreadsheets/d/${post.google_sheet_id}`
  const postJedwalUrl = `${config.api.url}/${accountId}/api/${post.api_key}`

  return (
    <div className="flex flex-col space-y-6 max-w-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <div className="flex space-x-2">
            <h2 className="text-h2">
              {post.spreadsheet_title ?? 'Unknown Title'}
            </h2>
          </div>
          <h3 className="text-lg font-accent text-muted-foreground">
            /api/{post.api_key}
          </h3>
        </div>
        <a
          href={postSourceUrl}
          target="_blank"
          className="text-sm underline hover:no-underline text-[#0000EE] w-fit"
        >
          View Source Google Sheet
        </a>
        <Separator />
      </div>
      <DashboardSection title="Data Update Cadence">
        <CacheInput
          defaultTtl={post.cache_duration}
          accountId={accountId}
          name={post.api_key}
        />
      </DashboardSection>
      <DashboardSection title="Content Link">
        <ApiCopyableSnippet
          base={postJedwalUrl}
          accountId={accountId}
          postId={apiId}
        />
      </DashboardSection>
      <DashboardSection title="Analytics">
        <AnalyticsChart
          accountId={accountId}
          resourceType={'api'}
          postId={apiId}
        />
      </DashboardSection>
      <DashboardSection
        title="Notifications"
        subTitle="Get notified whenever the underlying spreadsheet is updated. Supply a webhook URL that accepts POST requests."
      >
        <div className="pt-2">
          <ApiWatchChannels accountId={accountId} apiId={apiId} />
        </div>
      </DashboardSection>
      <DeleteApiButton postId={post.api_key} accountId={accountId} />
    </div>
  )
}
