// src/routes/_dashboard.$accountId.posts.$postId.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetchApis } from '@/data/fetchers'
import config from '@/config'
import { Separator } from '@/components/ui/separator'
import { DashboardSection } from '@/components/DashboardSection'
import { PostAnalyticsChart } from '@/components/PostAnalyticsChart'
import { PostLayoutSkeleton } from '@/components/PostLayoutSkeleton'
import { DeleteApiButton } from '@/components/apis/DeleteApiButton'
import { ApiCopyableSnippet } from '@/components/apis/ApiCopyableSnippet'
import { CacheInput } from '@/components/apis/ApiUpdateCadence'

export const Route = createFileRoute('/_dashboard/$accountId/apis/$apiId')({
  component: PostLayout,
})

function PostLayout() {
  const { accountId, apiId } = Route.useParams()
  const { data: posts, isLoading } = useQuery({
    queryKey: ['apis', accountId],
    queryFn: () => fetchApis(accountId),
    initialData: { results: [], failures: [] },
  })

  const post = posts.results.find((p) => p.sheet_api_name === apiId)

  if (isLoading || !post) {
    return <PostLayoutSkeleton />
  }

  const postSourceUrl = `https://docs.google.com/spreadsheets/d/${post.google_sheet_id}`
  const postJedwalUrl = `${config.api.url}/api/${accountId}/${post.sheet_api_name}`

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <h2 className="text-h2">{post.spreadsheet_title}</h2>
        </div>
        <h3 className="text-2xl font-accent text-primary">
          /doc/{post.sheet_api_name}
        </h3>
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
          name={post.sheet_api_name}
        />
      </DashboardSection>
      <DashboardSection title="Content Link">
        <ApiCopyableSnippet base={postJedwalUrl} worksheets={post.worksheets} />
      </DashboardSection>
      <DashboardSection title="Analytics">
        <PostAnalyticsChart accountId={accountId} postId={apiId} />
      </DashboardSection>
      <DeleteApiButton postId={post.sheet_api_name} accountId={accountId} />
    </div>
  )
}
