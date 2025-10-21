import { useState } from 'react'
import { Input } from '../ui/input'
import { GooglePicker } from '@/components/GooglePicker'
import { useCreatePost } from '@/hooks/use-posts'
import { useNavigate } from '@tanstack/react-router'
import { extractGoogleResourceId } from '@/lib/utils'
import { CreatePostModal } from './CreatePostModal'

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
  const [selectedDoc, setSelectedDoc] = useState<{
    id: string
    name: string
    url: string
  } | null>(null)
  const navigate = useNavigate()

  const mutation = useCreatePost(accountId)

  const handleSuccess = (data: { post_id: string }) => {
    setSheetUrl('')
    setSelectedDoc(null)
    navigate({
      to: '/$accountId/posts/$postId',
      params: { accountId, postId: data.post_id },
    })
  }

  const mutateWithCallback = async (slug: string) => {
    if (!selectedDoc) {
      return
    }
    const data = await mutation.mutateAsync({
      googleId: selectedDoc.id,
      slug,
    })
    handleSuccess(data)
  }

  return (
    <div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col space-y-2"
      >
        {showLabel && (
          <label htmlFor="create">
            <p className="text-h2">Create a New Post</p>
            <p className='text-xs text-gray-700'>Paste a Google Doc URL to get started</p>
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
            onPick={setSelectedDoc}
          />
        </div>
      </form>
      {mutation.isError && <p>{mutation.error.message}</p>}

      {selectedDoc && (
        <CreatePostModal
          title={selectedDoc.name}
          url={selectedDoc.url}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedDoc(null)
          }}
          onSubmit={mutateWithCallback}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  )
}
