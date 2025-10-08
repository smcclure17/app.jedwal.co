import { Link } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deleteOrganization } from '@/data/fetchers'

export function OrganizationPreviewCard({ org }: { org: any }) {
  const queryClient = useQueryClient()

  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null)

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
  )
}
