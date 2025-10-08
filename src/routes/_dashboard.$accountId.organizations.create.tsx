// src/routes/_dashboard.organizations.new.tsx
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/authContext'
import { Spinner } from '@/components/Spinner'
import { createOrganization } from '@/data/fetchers'

export const Route = createFileRoute(
  '/_dashboard/$accountId/organizations/create',
)({
  component: NewOrganizationPage,
})

// Mock create function - replace with your actual API call
async function onCreate(data: { name: string; emails: string[] }) {
  return createOrganization(data.name, data.emails)
}

function NewOrganizationPage() {
  const navigate = useNavigate()
  const [orgName, setOrgName] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [emailError, setEmailError] = useState('')
  const { user, error, isLoading } = useAuth()

  const createMutation = useMutation({
    mutationFn: onCreate,
    onSuccess: () => {
      // Navigate to the new organization or organizations list
      navigate({
        to: '/$accountId/organizations',
        params: { accountId: 'abc' },
      })
    },
    onError: () => {
      alert('Failed to create new organization. Please try again later')
    },
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim()

    if (!trimmedEmail) {
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address')
      return
    }

    if (emails.includes(trimmedEmail)) {
      setEmailError('This email has already been added')
      return
    }

    setEmails([...emails, trimmedEmail])
    setEmailInput('')
    setEmailError('')
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
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

  const handlePasteEmails = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const emailList = pastedText
      .split(/[\n,;]/)
      .map((email) => email.trim())
      .filter((email) => email && validateEmail(email))
      .filter((email) => !emails.includes(email))

    if (emailList.length > 0) {
      setEmails([...emails, ...emailList])
      setEmailInput('')
      setEmailError('')
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
        <Spinner srText="loading org page" />
      </div>
    )
  }

  if (user?.type === 'organization') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
        <span>Organization accounts cannot create organizations</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
        <span>Something went wrong</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
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

            <div className="space-y-2">
              <Label htmlFor="emails">Invite Team Members</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="emails"
                    type="email"
                    placeholder="email@example.com"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value)
                      setEmailError('')
                    }}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePasteEmails}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddEmail}
                  >
                    Add
                  </Button>
                </div>
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Press Enter to add, or paste multiple emails separated by
                  commas or new lines
                </p>
              </div>

              {emails.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">
                    Invited Members ({emails.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: '/$accountId/organizations',
                    params: { accountId: user.id },
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
    </div>
  )
}
