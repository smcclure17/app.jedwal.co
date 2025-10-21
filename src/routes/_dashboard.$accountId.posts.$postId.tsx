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
import { WebhookIntegrations } from '@/components/WebhookIntegrations'
import { PostAnalyticsChart } from '@/components/posts/PostAnalyticsChart'
import { PostLayoutSkeleton } from '@/components/posts/PostLayoutSkeleton'

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

  const post = posts?.find((p) => p.doc_api_name === postId)

  if (isLoading || !post) {
    return <PostLayoutSkeleton />
  }

  const postSourceUrl = `https://docs.google.com/document/d/${post.google_doc_id}`
  const postJedwalUrl = `${config.api.url}/doc/${accountId}/${post.doc_api_name}`

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <h2 className="text-h2">{post.title}</h2>
          <LastRepublishedSnippet lastModifiedIso={post.last_modified} />
        </div>
        <h3 className="text-2xl font-accent text-primary">
          /doc/{post.doc_api_name}
        </h3>
        <a
          href={postSourceUrl}
          target="_blank"
          className="text-sm underline hover:no-underline text-[#0000EE] w-fit"
        >
          View Source Google Document
        </a>
        <Separator />
        <PostRepublish accountId={accountId} postId={postId} />
      </div>
      <DashboardSection
        title="Content Link"
        subTitle="Use this URL in your app to access the post content"
      >
        <CopyableSnippet text={postJedwalUrl} />
      </DashboardSection>
      <DashboardSection title="Categories" subTitle='Add categories to make it easy to organize your posts'>
        <PostCategories
          accountId={accountId}
          postId={postId}
          categories={post.categories ?? []}
        />
      </DashboardSection>
      <DashboardSection title="Analytics" subTitle='See how many impressions your posts are driving'>
        <PostAnalyticsChart accountId={accountId} postId={postId} />
      </DashboardSection>
      <DashboardSection title="Webhook Integrations" subTitle='Webhook integrations allow your apps to stay up to date with your content.'>
        <WebhookIntegrations
          accountId={accountId}
          apiName={postId}
          webhooks={post.webhooks ?? []}
        />
      </DashboardSection>
      <DeletePostButton postId={post.doc_api_name} accountId={accountId} />
    </div>
  )
}
