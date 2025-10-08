// src/routes/_dashboard.organizations.index.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteOrganization, fetchUserData } from '@/data/fetchers'

export const Route = createFileRoute('/_dashboard/$accountId/organizations')({
  component: OrganizationsListPage,
})

function OrganizationsListPage() {
  const queryClient = useQueryClient()
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null)

  const { data: user, isLoading } = useQuery({
    queryKey: ['defaultUser'],
    queryFn: () => fetchUserData(),
    initialData: null,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultUser'] })
      setDeletingOrgId(null)
    },
    onError: () => {
      alert('Failed to delete organization. Please try again later.')
      setDeletingOrgId(null)
    },
  })

  const handleDeleteClick = (org: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const isConfirmed = confirm(
      `Are you sure you want to delete ${org.display_name} (${org.account_id})? This action cannot be undone.`,
    )

    if (isConfirmed) {
      setDeletingOrgId(org.account_id)
      deleteMutation.mutate(org.account_id)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    )
  }

  const organizations = user?.orgs || []

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground text-sm">
            Manage your organizations and teams
          </p>
        </div>
        <Button asChild>
          <Link
            to="/$accountId/organizations/create"
            params={{ accountId: user.id }}
          >
            Create Organization
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {organizations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No organizations found. Create one to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          organizations.map((org: any) => (
            <Card
              key={org.account_id}
              className="hover:bg-accent transition-colors"
            >
              <Link
                to="/$accountId/posts"
                params={{ accountId: org.account_id }}
                className="block"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{org.display_name}</CardTitle>
                        {org.isPremium && (
                          <Badge variant="secondary">Premium</Badge>
                        )}
                      </div>
                      <CardDescription>
                        Created {new Date(org.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteClick(org, e)}
                      disabled={deleteMutation.isPending}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {deletingOrgId === org.account_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
