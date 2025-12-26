import type { Api, ApiCreateResponse, ApiWatchChannel } from '@/schemas'
import config from '@/config'

export async function fetchApis(accountId: string) {
  const url = `${config.api.url}/manage/${accountId}/apis`
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${JSON.stringify(response)}`)
  }
  return response.json() as Promise<Array<Api>>
}

export async function deleteApi(accountId: string, postId: string) {
  const res = await fetch(
    `${config.api.url}/delete-api/${accountId}/${postId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (res.status !== 200) throw new Error('Failed to delete post')
}

// TODO: fix return type in backend and pipe it through to schemas
export const createApi = async (
  googleId: string,
  accountId?: string,
): Promise<ApiCreateResponse> => {
  const res = await fetch(`${config.api.url}/manage/${accountId}/apis`, {
    method: 'POST',
    body: JSON.stringify({
      google_sheet_id: googleId,
      frozen: false,
      cache_duration: 60,
    }),
    credentials: 'include',
    headers: { 'Content-type': 'application/json' },
  })

  if (res.status === 415) {
    const message = await res.json()
    throw new Error(message.detail)
  }

  if (!res.ok) {
    throw new Error(`Request returned status ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<ApiCreateResponse>
}

export const postTtlUpdate = async (
  accountId: string,
  apiName: string,
  ttl: number,
) => {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/apis/${apiName}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({
        cache_duration: ttl,
      }),
    },
  )

  if (res.status !== 200) throw new Error('Failed to delete API')
}

export async function fetchWorksheetNames(accountId: string, postId: string) {
  const url = `${config.api.url}/manage/${accountId}/apis/${postId}/worksheets`
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${JSON.stringify(response)}`)
  }
  return response.json()
}

export async function createApiWatchChannel(
  accountId: string,
  apiId: string,
  url: string,
  name: string,
) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/apis/${apiId}/notifications`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        api_key: apiId,
        owner_id: accountId,
        webhook_url: url,
        name,
      }),
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to create api watch channel: ${res.statusText}`)
  }
}

export async function getApiWatchChannels(accountId: string, apiId: string) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/apis/${apiId}/notifications`,
    { credentials: 'include' },
  )

  if (!res.ok) {
    throw new Error(`Failed to create webhook: ${res.statusText}`)
  }
  return res.json() as Promise<ApiWatchChannel>
}

export async function deleteApiWatchChannel(
  accountId: string,
  apiId: string,
  channelId: string,
) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/apis/${apiId}/notifications/${channelId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to delete api watch channel: ${res.statusText}`)
  }
}
