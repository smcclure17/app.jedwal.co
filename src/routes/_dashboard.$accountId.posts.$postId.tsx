// src/routes/_dashboard.$accountId.posts.$postId.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetchPosts } from '@/data/fetchers'
import { DeletePostButton } from '@/components/DeletePostButton'
import config from '@/config'
import PostRepublish from '@/components/posts/PostRepublish'
import PostCategories from '@/components/posts/PostCategories'
import { Separator } from '@/components/ui/separator'
import { CopyableSnippet } from '@/components/CopyableSnippet'
import { DashboardSection } from '@/components/DashboardSection'
import { LastRepublishedSnippet } from '@/components/LastRepublishedSnippet'
import { AnalyticsChart } from '@/components/posts/PostAnalyticsChart'
import { PostLayoutSkeleton } from '@/components/posts/PostLayoutSkeleton'
import { WebhookIntegrations } from '@/components/WebhookIntegrations'

export const Route = createFileRoute('/_dashboard/$accountId/posts/$postId')({
  head: ({ params }) => ({
    meta: [{ title: `Jedwal -- ${params.postId}` }],
  }),
  component: PostLayout,
})

function PostLayout() {
  const { accountId, postId } = Route.useParams()
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', accountId],
    queryFn: () => fetchPosts(accountId),
    initialData: [],
  })

  const post = posts?.find((p) => p.post_key === postId)

  if (isLoading || !post) {
    return <PostLayoutSkeleton />
  }

  const postSourceUrl = `https://docs.google.com/document/d/${post.google_doc_id}`
  const postJedwalUrl = `${config.api.url}/${accountId}/posts/${post.post_key}`

  console.log(post.post_key, 'post')

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-1">
          <h2 className="text-h2">{post.title}</h2>
          <h3 className="text-lg font-accent text-muted-foreground">
            /doc/{post.post_key}
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <PostRepublish accountId={accountId} postId={postId} />
          <span className="text-muted-foreground">|</span>
          <LastRepublishedSnippet lastModifiedIso={post.updated_at!} />
          <span className="text-muted-foreground">|</span>
          <a
            href={postSourceUrl}
            target="_blank"
            className="text-sm underline hover:no-underline text-blue-600 dark:text-blue-500 flex items-center gap-1"
          >
            View Source
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>

        <Separator />
      </div>
      <DashboardSection
        title="Content Link"
        subTitle="Use this URL in your app to access the post content"
      >
        <CopyableSnippet text={postJedwalUrl} />
      </DashboardSection>
      <DashboardSection
        title="Categories"
        subTitle="Add categories to make it easy to organize your posts"
      >
        <PostCategories
          accountId={accountId}
          postId={postId}
          categories={post.categories ?? []}
        />
      </DashboardSection>
      <DashboardSection
        title="Analytics"
        subTitle="See how many impressions your posts are driving"
      >
        <AnalyticsChart
          accountId={accountId}
          resourceType={'post'}
          postId={postId}
        />
      </DashboardSection>
      <DashboardSection
        title="Webhook Integrations"
        subTitle="Webhook integrations allow your apps to stay up to date with your content."
      >
        <WebhookIntegrations
          accountId={accountId}
          apiName={postId}
        />
      </DashboardSection>
      <DeletePostButton postId={post.post_key} accountId={accountId} />
    </div>
  )
}
