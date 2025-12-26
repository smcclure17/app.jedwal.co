import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ApiWatchChannel } from '@/schemas'

export interface ApiWatchChannelTableProps {
  channels: ApiWatchChannel[]
  onCreateChannel?: (name: string, webhookUrl: string) => void
  onDeleteChannel?: (channelId: string) => void
}

export function ApiWatchChannelTable({
  channels,
  onCreateChannel,
  onDeleteChannel,
}: ApiWatchChannelTableProps) {
  const [name, setName] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')

  const handleCreate = () => {
    if (!name || !webhookUrl) {
      alert('Please enter both name and webhook URL')
      return
    }
    onCreateChannel?.(name, webhookUrl)
    setName('')
    setWebhookUrl('')
  }

  const handleDelete = (channelId: string) => {
    if (!confirm('Delete this watch channel?')) return
    console.log(channelId)
    onDeleteChannel?.(channelId)
  }

  return (
    <div className="flex flex-col space-y-2">
      {channels.length > 0 && (
        <div className="overflow-hidden border rounded-md">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Webhook URL
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {channels.map((channel) => (
                <tr key={channel.channel_id}>
                  <td className="px-4 py-3 text-sm">{channel.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600 truncate max-w-xs">
                    {channel.webhook_url}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="link"
                      className='text-red-500'
                      size="sm"
                      onClick={() => handleDelete(channel.channel_id)}
                    >
                      Revoke
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="">
        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="channel-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="channel-name"
                type="text"
                placeholder="My Watch Channel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="webhook-url" className="text-sm font-medium">
                Webhook URL
              </label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://api.example.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-fit" variant={"outline"} disabled={!name || !webhookUrl}>
            Create New Webhook
          </Button>
        </div>
      </div>
    </div>
  )
}
