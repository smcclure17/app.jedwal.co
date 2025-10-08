import { useState } from 'react'
import { Input } from './ui/input'
import { GooglePicker } from '@/components/GooglePicker'
import { createPost } from '@/data/fetchers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { extractGoogleResourceId } from '@/lib/utils'

export interface CreateApiFormProps {
  accountId: string
  disabled?: boolean
  showLabel?: boolean
}

export const CreatePostForm = ({
  accountId,
  disabled = false,
  showLabel = true,
}: CreateApiFormProps) => {
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetId, setSheetId] = useState('') // just the extracted ID
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (googleId: string) => createPost(googleId, accountId),
    onSuccess: (data) => {
      setSheetUrl('')
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
      navigate({
        to: '/$accountId/posts/$postId',
        params: { accountId, postId: data.post_id },
      })
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col space-y-2"
      >
        {showLabel && (
          <label htmlFor="create" className="text-h2">
            Create a New Post
          </label>
        )}
        <div className="flex flex-row space-x-2">
          <Input
            disabled={disabled}
            type="text"
            onChange={(e) => {
              setSheetUrl(e.target.value)
              setSheetId(extractGoogleResourceId(e.target.value))
            }}
            className="font-accent"
            value={sheetUrl}
            placeholder={
              disabled
                ? 'Upgrade to create more posts'
                : 'https://docs.google.com/document/d/...'
            }
            required
          />
          <GooglePicker
            accountId={accountId}
            fileId={sheetId}
            disabled={disabled || mutation.isPending}
            fetcher={(fileId) => mutation.mutateAsync(fileId)}
          />
        </div>
      </form>
      {mutation.isError && <p>{mutation.error.message}</p>}
    </div>
  )
}
