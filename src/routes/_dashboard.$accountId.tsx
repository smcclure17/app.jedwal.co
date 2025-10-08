// src/routes/_dashboard.$accountId.tsx
import { BreadcrumbMagic } from '@/components/BreadcrumbMagic'
import { NotFoundScreen } from '@/components/NotFoundScreen'
import { Sidebar } from '@/components/Sidebar'
import { Spinner } from '@/components/Spinner'
import { AuthProvider } from '@/contexts/authContext'
import { fetchUserData } from '@/data/fetchers'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

// src/routes/_dashboard.$accountId.tsx
export const Route = createFileRoute('/_dashboard/$accountId')({
  component: AccountLayout,
})

function AccountLayout() {
  const { accountId } = Route.useParams()

  const { data: user, isLoading } = useQuery({
    queryKey: ['defaultUser'],
    queryFn: () => fetchUserData(),
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner srText="Checking authentication..."></Spinner>
      </div>
    )
  }

  if (!user) {
    return <NotFoundScreen />
  }

  const userOrgIds = user.orgs?.map((org: any) => org.account_id) ?? []
  const isAuthorized = user.id === accountId || userOrgIds.includes(accountId)

  if (!isAuthorized) {
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
