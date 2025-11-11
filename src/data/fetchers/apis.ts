import type { Api, ApiCreateResponse } from '@/schemas'
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
  const res = await fetch(`${config.api.url}/api`, {
    method: 'POST',
    body: JSON.stringify({ google_id: googleId, owner_id: accountId }),
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
