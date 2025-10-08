import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createOrganization } from '@/data/fetchers'
import { EmailInviteInput } from './EmailInviteInput'
import { EmailList } from './EmailList'

interface OrganizationFormProps {
  userId: string
  onSuccess: (orgName: string) => void
}

export function OrganizationForm({
  userId,
  onSuccess,
}: OrganizationFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [orgName, setOrgName] = useState('')
  const [emails, setEmails] = useState<string[]>([])

  const createMutation = useMutation({
    mutationFn: (data: { name: string; emails: string[] }) =>
      createOrganization(data.name, data.emails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultUser'] })
      onSuccess(orgName)
    },
    onError: () => {
      alert('Failed to create new organization. Please try again later')
    },
  })

  const handleAddEmails = (newEmails: string[]) => {
    setEmails([...emails, ...newEmails])
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orgName.trim()) {
      createMutation.mutate({
        name: orgName.trim(),
        emails,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-h2">Create New Organization</CardTitle>
        <CardDescription>
          Set up a new organization and invite team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              type="text"
              placeholder="Acme Corporation"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>

          <EmailInviteInput
            onAddEmails={handleAddEmails}
            existingEmails={emails}
          />

          <EmailList emails={emails} onRemoveEmail={handleRemoveEmail} />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({
                  to: '/$accountId/organizations',
                  params: { accountId: userId },
                })
              }
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!orgName.trim() || createMutation.isPending}
            >
              {createMutation.isPending
                ? 'Creating...'
                : 'Create Organization'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
