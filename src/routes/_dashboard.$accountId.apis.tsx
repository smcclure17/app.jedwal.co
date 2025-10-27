// src/routes/_dashboard.$accountId.posts.tsx
import { ApisList } from '@/components/apis/ApisList'
import { CreateApiForm } from '@/components/apis/CreateApiForm'
import { FirstApiSplash } from '@/components/apis/FirstApiSplash'
import { ApisLayoutSkeleton } from '@/components/apis/ApisLayoutSkeleton'
import { useApis } from '@/hooks/use-apis'
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { useUserData } from '@/hooks/use-user'

export const Route = createFileRoute('/_dashboard/$accountId/apis')({
  head: () => ({
    meta: [{ title: 'Jedwal -- APIs' }],
  }),
  component: PostsLayout,
})

function PostsLayout() {
  const { accountId } = Route.useParams()
  const { apiId } = useParams({ strict: false }) // might exist

  const { data: posts } = useApis(accountId)
  const { data: user } = useUserData(accountId)


  // Show skeleton while loading to prevent flicker
  if (posts === null || user === null) {
    return <ApisLayoutSkeleton />
  }

  if (posts.results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center pt-10">
        <FirstApiSplash accountId={accountId} />
      </div>
    )
  }

  const disableCreate = user?.account_status === 'free' && posts.results.length >= 2

  return (
    <div>
      <div className="flex flex-col space-y-12 mr-12 pt-10 pl-4">
        <CreateApiForm accountId={accountId} disabled={disableCreate}/>
        <div className="flex space-x-8">
          <div className="max-w-sm ">
            <ApisList
              accountId={accountId}
              selectedPostId={apiId}
              posts={posts ?? { results: [], failures: [] }}
              showPremiumCard={disableCreate}
            />
          </div>
          <div className="w-0.25 bg-gray-300" />
          {apiId ? (
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
