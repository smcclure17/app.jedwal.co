import { useState } from 'react'
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
import { useCreateOrganization } from '@/hooks/use-organizations'
import { useCheckOrgNameAvailable } from '@/hooks/use-check-org-name-available'
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
  const [orgName, setOrgName] = useState('')
  const [emails, setEmails] = useState<string[]>([])

  const createMutation = useCreateOrganization()
  const { data: isAvailable, isLoading: isCheckingAvailability } = useCheckOrgNameAvailable(orgName)

  const handleCreateSuccess = () => {
    onSuccess(orgName)
  }

  const handleCreateError = () => {
    alert('Failed to create new organization. Please try again later')
  }

  const handleAddEmails = (newEmails: string[]) => {
    setEmails([...emails, ...newEmails])
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAvailable) return
    if (orgName.trim()) {
      createMutation.mutate(
        {
          name: orgName.trim(),
          emails,
        },
        {
          onSuccess: handleCreateSuccess,
          onError: handleCreateError,
        },
      )
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
            <div className="flex items-center gap-2 text-xs min-h-[1rem]">
              {!isCheckingAvailability && isAvailable === false && (
                <span className="text-red-600">
                  Organization name taken. Please try another
                </span>
              )}
            </div>
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
              disabled={!orgName.trim() || createMutation.isPending || !isAvailable || isCheckingAvailability}
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
