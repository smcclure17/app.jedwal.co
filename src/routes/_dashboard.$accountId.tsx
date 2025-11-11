// src/routes/_dashboard.$accountId.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BreadcrumbMagic } from '@/components/BreadcrumbMagic'
import { NotFoundScreen } from '@/components/NotFoundScreen'
import { Sidebar } from '@/components/Sidebar'
import { Spinner } from '@/components/Spinner'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAccountContext } from '@/hooks/use-user'
import { usePosts } from '@/hooks/use-posts'
import { useApis } from '@/hooks/use-apis'

// src/routes/_dashboard.$accountId.tsx
export const Route = createFileRoute('/_dashboard/$accountId')({
  component: AccountLayout,
})

function AccountLayout() {
  const { accountId } = Route.useParams()
  const { data: context, isLoading } = useAccountContext(accountId)

  // Prefetch posts and APIs data in the background
  // These will be cached and ready when navigating to /posts or /apis
  usePosts(accountId)
  useApis(accountId)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner srText="Checking authentication..."></Spinner>
      </div>
    )
  }

  if (context === "not ok") {
    return <NotFoundScreen />
  }

  return (
    <AuthProvider accountId={accountId}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <BreadcrumbMagic />
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
