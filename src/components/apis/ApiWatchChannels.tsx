import { ApiWatchChannelTable } from './ApiWatchChannelTable'
import {
  useApiWatchChannels,
  useCreateApiWatchChannel,
  useDeleteApiWatchChannel,
} from '@/hooks/use-apis'

export interface ApiWatchChannelsProps {
  accountId: string
  apiId: string
}

export function ApiWatchChannels({ accountId, apiId }: ApiWatchChannelsProps) {
  const { data: channels, isLoading } = useApiWatchChannels(accountId, apiId)
  const createMutation = useCreateApiWatchChannel(accountId, apiId)
  const deleteMutation = useDeleteApiWatchChannel(accountId, apiId)

  const handleCreate = async (name: string, webhookUrl: string) => {
    try {
      await createMutation.mutateAsync({ name, url: webhookUrl })
    } catch (error: any) {
      alert(error.message || 'Failed to create watch channel')
    }
  }

  const handleDelete = async (channelId: string) => {
    try {
      await deleteMutation.mutateAsync(channelId)
    } catch (error: any) {
      alert(error.message || 'Failed to delete watch channel')
    }
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading watch channels...</div>
  }

  return (
    <ApiWatchChannelTable
      channels={channels ?? []}
      onCreateChannel={handleCreate}
      onDeleteChannel={handleDelete}
    />
  )
}
