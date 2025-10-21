import { useState } from 'react'
import { WebhookIntegration } from '@/schemas'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { createWebhook, deleteWebhook } from '@/data/fetchers'

export interface WebhookListProps {
  webhooks: WebhookIntegration[]
  accountId: string
  apiName: string
}

export function WebhookIntegrations({
  webhooks,
  accountId,
  apiName,
}: WebhookListProps) {
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [payload, setPayload] = useState('')
  const [allWebhooks, setAllWebhooks] = useState(webhooks)

  const handleCreate = async () => {
    if (!url) return alert('Please enter a URL')
    try {
      await createWebhook(accountId, apiName, url, method)
      setUrl('')
      setPayload('')
      setName('')
      setAllWebhooks([...allWebhooks, { url, method, payload, name }])
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleDelete = async (targetUrl: string) => {
    if (!confirm(`Delete webhook ${targetUrl}?`)) return
    try {
      await deleteWebhook(accountId, apiName, targetUrl)
      setAllWebhooks(allWebhooks.filter((w) => w.url !== targetUrl))
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="flex flex-col space-y-4 max-w-md">
      <div className="flex flex-col space-y-2 text-sm">
        <span>Add a webhook</span>
        <Input
          type="text"
          placeholder="Webhook Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
        <div className="flex flex-row space-x-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="border p-1 rounded-md"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <Input
            type="text"
            placeholder="Webhook URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>
        <textarea
          placeholder="Payload (optional)"
          value={JSON.stringify(payload)}
          disabled={method !== 'POST'}
          onChange={(e) => setPayload(e.target.value)}
          className="border p-1 rounded text-sm disabled:bg-gray-50"
        />
        <Button
          variant={'outline'}
          onClick={handleCreate}
          className="px-3 py-1"
        >
          Add Webhook
        </Button>
      </div>

      {/* Existing webhooks */}
      <div className="flex flex-col space-y-2 text-sm">
        {allWebhooks.length > 0 && <span>Existing integrations</span>}
        {allWebhooks.map((webhook, i: number) => (
          <div
            key={i}
            className="flex flex-row justify-between items-center border px-2 py-1 rounded"
          >
            <div className="flex flex-col">
              <span className="font-mono text-sm">{webhook.method}</span>
              <span className="text-sm">{webhook.name ?? (webhook.url.slice(0, 32) + "...")}</span>
            </div>
            <Button
              variant={'link'}
              onClick={() => handleDelete(webhook.url)}
              className="text-red-500 cursor-pointer"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
