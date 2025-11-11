// src/routes/_dashboard.$accountId.posts.tsx
import { Outlet, createFileRoute, useParams } from '@tanstack/react-router'
import { CreatePostForm } from '@/components/posts/CreatePostForm'
import { FirstDocSplash } from '@/components/FirstDocSplash'
import { PostsList } from '@/components/posts/PostsList'
import { PostsLayoutSkeleton } from '@/components/posts/PostsLayoutSkeleton'
import { usePosts } from '@/hooks/use-posts'
import { useUserData } from '@/hooks/use-user'

export const Route = createFileRoute('/_dashboard/$accountId/posts')({
  head: () => ({
    meta: [{ title: 'Jedwal -- Posts' }],
  }),
  component: PostsLayout,
})

function PostsLayout() {
  const { accountId } = Route.useParams()
  const { postId } = useParams({ strict: false }) // might exist

  const { data: posts } = usePosts(accountId)
  const { data: user } = useUserData(accountId)

  // Show skeleton while loading to prevent flicker
  if (posts === null || user === null) {
    return <PostsLayoutSkeleton />
  }

  const disableCreate = user?.account_status === 'free' && posts?.length >= 2

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center pt-10">
        <FirstDocSplash accountId={accountId} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col space-y-12 mr-12 pt-10 pl-4">
        <CreatePostForm accountId={accountId} disabled={disableCreate}/>
        <div className="flex space-x-12">
          <div className="max-w-sm ">
            <PostsList
              accountId={accountId}
              selectedPostId={postId}
              posts={posts}
              showPremiumCard={disableCreate}
            />
          </div>
          <div className="w-0.25 bg-gray-300" />
          {postId ? (
            <Outlet />
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <span>Select or create a post to get started</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
