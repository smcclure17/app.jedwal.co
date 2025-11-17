import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { createWebhook, deleteWebhook } from '@/data/fetchers'
import { useWebhooks } from '@/hooks/use-posts'

export interface WebhookListProps {
  accountId: string
  apiName: string
}

export function WebhookIntegrations({ accountId, apiName }: WebhookListProps) {
  const { data: webhooks, isLoading } = useWebhooks(accountId, apiName)

  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [payload, setPayload] = useState('{}')

  const [allWebhooks, setAllWebhooks] = useState<any[]>([])

  // Sync with fetched webhooks
  useEffect(() => {
    if (webhooks?.webhooks) {
      setAllWebhooks(webhooks.webhooks)
    }
  }, [webhooks])

  if (isLoading || !webhooks) return <>loading...</>

  const handleCreate = async () => {
    if (!url) return alert('Please enter a URL')

    try {
      await createWebhook(accountId, apiName, url, name, method, payload)

      setUrl('')
      setPayload('{}')
      setName('')

      setAllWebhooks((prev) => [
        ...prev,
        {
          url,
          name: name || url, // fallback if name is empty
          method,
          payload: method === 'POST' ? JSON.parse(payload || '{}') : undefined,
        },
      ])
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleDelete = async (webhook: any) => {
    if (!confirm(`Delete webhook ${webhook.url}?`)) return

    try {
      await deleteWebhook(
        accountId,
        apiName,
        webhook.url,
        webhook.name,
        webhook.method,
      )

      setAllWebhooks((prev) => prev.filter((w) => w.url !== webhook.url))
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
          />
        </div>

        <textarea
          placeholder="Payload (optional)"
          value={payload}
          disabled={method !== 'POST'}
          onChange={(e) => setPayload(e.target.value)}
          className="border p-1 rounded text-sm disabled:bg-gray-50"
        />

        <Button variant="outline" onClick={handleCreate}>
          Add Webhook
        </Button>
      </div>

      <div className="flex flex-col space-y-2 text-sm">
        {allWebhooks.length > 0 && <span>Existing integrations</span>}

        {allWebhooks.map((webhook, i) => (
          <div
            key={i}
            className="flex flex-row justify-between items-center border px-2 py-1 rounded"
          >
            <div className="flex flex-col">
              <span className="font-mono text-sm">{webhook.method}</span>
              <span className="text-sm">
                {webhook.name || webhook.url.slice(0, 32) + '...'}
              </span>
            </div>

            <Button
              variant="link"
              onClick={() => handleDelete(webhook)}
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
