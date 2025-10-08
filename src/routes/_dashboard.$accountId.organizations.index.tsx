// src/routes/_dashboard.organizations.index.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchUserData } from '@/data/fetchers'
import { OrganizationPreviewCard } from '@/components/organizations/OrganizationPreviewCard'

export const Route = createFileRoute('/_dashboard/$accountId/organizations/')({
  component: OrganizationsListPage,
})

function OrganizationsListPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['defaultUser'],
    queryFn: () => fetchUserData(),
    initialData: null,
  })

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    )
  }

  const organizations = user?.orgs || []

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex flex-row w-full justify-between items-center">
            <div>
              <CardTitle className="text-h2">Organizations</CardTitle>
              <CardDescription>
                Manage your organizations and teams
              </CardDescription>
            </div>
            <Link
              to={'/$accountId/organizations/create'}
              params={{ accountId: user.id }}
            >
              <Button>Create New Organization</Button>
            </Link>
          </div>
        </CardHeader>

        <div className="grid gap-4 px-8">
          {organizations.length === 0 ? (
            <Card>
              <CardContent className="pt-8">
                <p className="text-center text-muted-foreground">
                  No organizations found. Create one to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            organizations.map((org: any) => (
              <OrganizationPreviewCard org={org} />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
