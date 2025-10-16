import { useState } from 'react'
import { Input } from '../ui/input'
import { GooglePicker } from '@/components/GooglePicker'
import { useCreatePost } from '@/hooks/use-posts'
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
  const navigate = useNavigate()

  const mutation = useCreatePost(accountId)

  const handleSuccess = (data: { post_id: string }) => {
    setSheetUrl('')
    navigate({
      to: '/$accountId/posts/$postId',
      params: { accountId, postId: data.post_id },
    })
  }

  const mutateWithCallback = async (googleId: string) => {
    const data = await mutation.mutateAsync(googleId)
    handleSuccess(data)
    return data
  }

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
            fetcher={mutateWithCallback}
          />
        </div>
      </form>
      {mutation.isError && <p>{mutation.error.message}</p>}
    </div>
  )
}
