import { Link, useParams } from '@tanstack/react-router'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useDeleteOrganization } from '@/hooks/use-organizations'

export function OrganizationPreviewCard({ org }: { org: any }) {
  const { accountId } = useParams({ strict: false })
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null)
  const deleteMutation = useDeleteOrganization()

  const handleDeleteClick = (org: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const isConfirmed = confirm(
      `Are you sure you want to delete ${org.display_name} (${org.account_id})? This action cannot be undone.`,
    )

    if (isConfirmed) {
      setDeletingOrgId(org.account_id)
      deleteMutation.mutate(org.account_id, {
        onSuccess: () => {
          setDeletingOrgId(null)
        },
        onError: () => {
          alert('Failed to delete organization. Please try again later.')
          setDeletingOrgId(null)
        },
      })
    }
  }

  return (
    <Card
      key={org.account_id}
      className="hover:bg-accent transition-colors border"
    >
      <Link
        to="/$accountId/posts"
        params={{ accountId: org.account_id }}
        className="block"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center">
                <CardTitle>{org.display_name}</CardTitle>
              </div>
              <CardDescription>
                Created {new Date(org.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            {org.created_by === accountId && (
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
            )}
          </div>
        </CardHeader>
      </Link>
    </Card>
  )
}
