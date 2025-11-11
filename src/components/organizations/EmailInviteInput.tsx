import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailInviteInputProps {
  onAddEmails: (emails: Array<string>) => void
  existingEmails: Array<string>
}

export function EmailInviteInput({
  onAddEmails,
  existingEmails,
}: EmailInviteInputProps) {
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')

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

    if (existingEmails.includes(trimmedEmail)) {
      setEmailError('This email has already been added')
      return
    }

    onAddEmails([trimmedEmail])
    setEmailInput('')
    setEmailError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handlePasteEmails = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const emailList = pastedText
      .split(/[\n,;]/)
      .map((email) => email.trim())
      .filter((email) => email && validateEmail(email))
      .filter((email) => !existingEmails.includes(email))

    if (emailList.length > 0) {
      onAddEmails(emailList)
      setEmailInput('')
      setEmailError('')
    }
  }

  return (
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
          <Button type="button" variant="secondary" onClick={handleAddEmail}>
            Add
          </Button>
        </div>
        {emailError && <p className="text-sm text-destructive">{emailError}</p>}
        <p className="text-sm text-muted-foreground">
          Press Enter to add, or paste multiple emails separated by commas or
          new lines
        </p>
      </div>
    </div>
  )
}
