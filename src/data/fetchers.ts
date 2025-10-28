import config from '@/config'
import {
  ApiInvocationResponse,
  ApisMetadata,
  CreatePostResponse,
  PostsMetadata,
  UserDataResponse,
} from '@/schemas'

export async function fetchPosts(accountId: string) {
  const url = `${config.api.url}/docs/metadata/${accountId}`
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${JSON.stringify(response)}`)
  }
  const json: PostsMetadata = await response.json()
  return json.apis
}

export const createPost = async (
  googleId: string,
  docApiName: string,
  accountId?: string,
): Promise<CreatePostResponse> => {
  const res = await fetch(`${config.api.url}/doc`, {
    method: 'POST',
    body: JSON.stringify({
      google_id: googleId,
      owner_id: accountId,
      doc_api_name: docApiName,
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

  return res.json()
}

export async function deletePost(accountId: string, postId: string) {
  const res = await fetch(`${config.api.url}/doc/${accountId}/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (res.status !== 200) throw new Error('Failed to delete post')
}

export const republishPost = async (accountId: string, postId: string) => {
  const res = await fetch(`${config.api.url}/doc/publish`, {
    method: 'POST',
    body: JSON.stringify({
      owner_id: accountId,
      api_name: postId,
    }),
    credentials: 'include',
    headers: { 'Content-type': 'application/json' },
  })

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
  const res = await fetch(`${config.api.url}/doc/add-category`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: category.trim(),
      owner_id: accountId,
      api_name: postId,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to add category. Status: ${res.status}`)
  }

  return res.json()
}

export async function removePostCategory(
  accountId: string,
  postId: string,
  category: string,
) {
  const res = await fetch(
    `${
      config.api.url
    }/doc/delete-category/${accountId}/${postId}?category=${encodeURIComponent(
      category,
    )}`,
    { method: 'DELETE', credentials: 'include' },
  )

  if (!res.ok) {
    throw new Error(`Failed to remove category. Status: ${res.status}`)
  }

  return res.json()
}

export async function updatePostSlug(
  accountId: string,
  postId: string,
  slug: string,
) {
  const res = await fetch(`${config.api.url}/doc/update-slug`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: slug.trim(),
      owner_id: accountId,
      api_name: postId,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to add category. Status: ${res.status}`)
  }

  return res.json()
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

export async function getApiAnalytics(accountId: string, apiName: string) {
  const startTime = new Date()
  const thirtyDaysAgo = new Date(startTime)
  thirtyDaysAgo.setDate(startTime.getDate() - 30)
  const dateParam = thirtyDaysAgo.toISOString()

  const res = await fetch(
    `${config.api.url}/get-api-invocations?sheet_api_name=${apiName}&account_id=${accountId}&start_time=${dateParam}`,
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics for ${accountId}/${apiName}`)
  }

  return res.json() as Promise<ApiInvocationResponse[]>
}

export async function fetchUserData(accountId?: string) {
  const query = accountId ? `?account_id=${encodeURIComponent(accountId)}` : ''
  const res = await fetch(`${config.api.url}/get-account-data${query}`, {
    credentials: 'include',
  })

  if (res.status === 401) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch account data for ID: ${accountId}`)
  }

  return res.json() as Promise<UserDataResponse>
}

export async function fetchApis(accountId: string) {
  const url = `${config.api.url}/get-all-sheets/${accountId}`
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${JSON.stringify(response)}`)
  }
  return response.json() as Promise<ApisMetadata>
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
): Promise<{ api_name: string; url: string }> => {
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

  return res.json()
}

export const postTtlUpdate = async (
  accountId: string,
  apiName: string,
  ttl: number,
) => {
  const res = await fetch(`${config.api.url}/update-cache-duration`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({
      owner_id: accountId,
      api_name: apiName,
      cache_duration: ttl,
    }),
  })

  if (res.status !== 200) throw new Error('Failed to delete API')
}

export async function createOrganization(name: string, invitees: string[]) {
  const res = await fetch(`${config.api.url}/create-organization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ name, invitees }),
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
  const response = await fetch(`${config.api.url}/create-checkout`, {
    method: "POST",
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("User Not Logged In");
  }

  if (!response.ok) {
    throw new Error(`Failed to create checkout: ${response.statusText}`);
  }

  const { url } = await response.json();
  return url
};
