import { X } from 'lucide-react'

interface EmailListProps {
  emails: Array<string>
  onRemoveEmail: (email: string) => void
}

export function EmailList({ emails, onRemoveEmail }: EmailListProps) {
  if (emails.length === 0) {
    return null
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium">Invited Members ({emails.length})</p>
      <div className="flex flex-wrap gap-2">
        {emails.map((email) => (
          <div
            key={email}
            className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
          >
            <span>{email}</span>
            <button
              type="button"
              onClick={() => onRemoveEmail(email)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
