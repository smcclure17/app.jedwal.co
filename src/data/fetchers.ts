import type {
  AccountRead,
  ApiInvocationResponse,
  Post,
  PostCreateResponse,
} from '@/schemas'
import config from '@/config'

export async function fetchPosts(accountId: string) {
  const url = `${config.api.url}/manage/${accountId}/posts`
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${JSON.stringify(response)}`)
  }
  return response.json() as unknown as Array<Post>
}

export const createPost = async (
  googleId: string,
  docApiName: string,
  accountId: string,
): Promise<PostCreateResponse> => {
  const res = await fetch(`${config.api.url}/manage/${accountId}/posts/`, {
    method: 'POST',
    body: JSON.stringify({
      google_doc_id: googleId,
      post_key: docApiName,
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

  return res.json() as Promise<PostCreateResponse>
}

export async function deletePost(accountId: string, postId: string) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/posts/${postId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (res.status !== 200) throw new Error('Failed to delete post')
}

export const republishPost = async (accountId: string, postId: string) => {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/posts/${postId}/refresh`,
    {
      method: 'POST',
      body: JSON.stringify({
        owner_id: accountId,
        api_name: postId,
      }),
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    },
  )

  if (res.status !== 200) {
    throw new Error(`Failed to republish. Status: ${res.status}`)
  }

  return res.json()
}

export async function addPostCategory(
  accountId: string,
  postId: string,
  category: string,
) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/posts/${postId}/categories`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: category.trim(),
      }),
    },
  )

  if (!res.ok) {
    throw new Error(`Failed to add category. Status: ${res.status}`)
  }
}

export async function removePostCategory(
  accountId: string,
  postId: string,
  category: string,
) {
  const res = await fetch(
    `${config.api.url}/manage/${accountId}/posts/${postId}/categories/${category}`,
    { method: 'DELETE', credentials: 'include' },
  )

  if (!res.ok) {
    throw new Error(`Failed to remove category. Status: ${res.status}`)
  }
}

export async function createWebhook(
  ownerId: string,
  apiName: string,
  url: string,
  method: string,
) {
  const res = await fetch(`${config.api.url}/doc/add-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      owner_id: ownerId,
      api_name: apiName,
      webhook: { url, method, payload: {} },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create webhook: ${res.statusText}`)
  }
}

export async function deleteWebhook(
  ownerId: string,
  apiName: string,
  url: string,
) {
  const res = await fetch(`${config.api.url}/doc/delete-webhook`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      owner_id: ownerId,
      api_name: apiName,
      url,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to delete webhook: ${res.statusText}`)
  }
}

export async function getAnalytics(
  accountId: string,
  resourceType: string,
  name: string,
) {
  const startTime = new Date()
  const thirtyDaysAgo = new Date(startTime)
  thirtyDaysAgo.setDate(startTime.getDate() - 30)
  const dateParam = thirtyDaysAgo.toISOString()
  const url = `${config.api.url}/manage/${accountId}/analytics/${resourceType}/${name}`
  const res = await fetch(`${url}?start_time=${dateParam}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch analytics for ${accountId}/${resourceType}/${name}`,
    )
  }

  return res.json() as Promise<Array<ApiInvocationResponse>>
}

export async function fetchUserData(accountId?: string) {
  const meUrl = `${config.api.url}/me`
  const accountUrl = `${config.api.url}/manage/${accountId}`
  const url = accountId ? accountUrl : meUrl

  const res = await fetch(url, {
    credentials: 'include',
  })

  if (res.status === 401) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch account data for ID: ${accountId}`)
  }

  return res.json() as Promise<AccountRead>
}

export async function createOrganization(
  accountId: string,
  name: string,
  invitees: Array<string>,
) {
  const res = await fetch(`${config.api.url}/manage/${accountId}/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ organization_name: name, memberships: invitees }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to create org. Error status: ${res.status}`)
  }
  return res.json()
}

export const deleteOrganization = async (orgId: string) => {
  const res = await fetch(`${config.api.url}/organization/${orgId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (res.status !== 200) throw new Error('Failed to delete API')
  return res.json()
}

export const createCheckout = async () => {
  const response = await fetch(`${config.api.url}/billing/create-checkout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (response.status === 401) {
    throw new Error('User Not Logged In')
  }

  if (!response.ok) {
    throw new Error(`Failed to create checkout: ${response.statusText}`)
  }

  const { url } = await response.json()
  return url
}

export async function getOrganizations(accountId: string) {
  const url = `${config.api.url}/manage/${accountId}/organizations`
  const res = await fetch(url, { credentials: 'include' })

  if (res.status !== 200) throw new Error('Failed to fetch organizations')
  return res.json()
}

export async function getOrganizationMembers(accountId: string, orgId: string) {
  const url = `${config.api.url}/manage/${accountId}/organizations/${orgId}/memberships`
  const res = await fetch(url, { credentials: 'include' })

  if (res.status !== 200)
    throw new Error('Failed to fetch organization members')
  return res.json()
}

export async function fetchAccountContext(accountId: string) {
  const url = `${config.api.url}/manage/${accountId}`
  const res = await fetch(url, { credentials: 'include' })

  if (res.status === 403) {
    return 'not ok'
  }
  if (!res.ok) {
    throw new Error('Failed to fetch account context')
  }
  return 'ok'
}
