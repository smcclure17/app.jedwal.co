import { useState } from 'react'
import { Input } from '../ui/input'
import { GooglePicker } from '@/components/GooglePicker'
import { useCreateApi } from '@/hooks/use-apis'
import { useNavigate } from '@tanstack/react-router'
import { extractGoogleResourceId } from '@/lib/utils'
import { CreateApiModal } from './CreateApiModal'

export interface CreateApiFormProps {
  accountId: string
  disabled?: boolean
  showLabel?: boolean
}

export const CreateApiForm = ({
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

  const mutation = useCreateApi(accountId)

  const handleSuccess = (data: { api_name: string }) => {
    setSheetUrl('')
    setSelectedDoc(null)
    navigate({
      to: '/$accountId/apis/$apiId',
      params: { accountId, apiId: data.api_name },
    })
  }

  const handleCreateApi = async () => {
    if (!selectedDoc) return
    const data = await mutation.mutateAsync(selectedDoc.id)
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
            <p className="text-h2">Create a New API</p>
            <p className='text-xs text-gray-700'>Paste a Google Sheet URL to get started</p>
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
                : 'https://docs.google.com/spreadsheets/d/...'
            }
            required
          />
          <GooglePicker
            accountId={accountId}
            fileId={sheetId}
            disabled={disabled || mutation.isPending}
            onPick={setSelectedDoc}
            submitTitle='Create New API'
          />
        </div>
      </form>
      {mutation.isError && <p>{mutation.error.message}</p>}

      {selectedDoc && (
        <CreateApiModal
          title={selectedDoc.name}
          url={selectedDoc.url}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedDoc(null)
          }}
          onSubmit={handleCreateApi}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  )
}
