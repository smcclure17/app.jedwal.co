import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import config from '@/config'

async function checkNameAvailable(
  accountId: string,
  name: string,
): Promise<boolean> {
  const url = `${config.api.url}/posts/${accountId}/${name}`
  const response = await fetch(url, {
    credentials: 'include',
    method: 'HEAD',
  })

  if (response.status === 404) {
    return true // 404 means no post exists, so the name is available
  } else if (response.ok) {
    return false
  } else {
    throw new Error(
      `Failed to check name availability: ${response.status} ${response.statusText}`,
    )
  }
}

export function useCheckNameAvailable(
  accountId: string,
  name: string,
  debounceMs: number = 500,
) {
  const [debouncedName, setDebouncedName] = useState(name)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [name, debounceMs])

  return useQuery({
    queryKey: ['check-name-available', accountId, debouncedName],
    queryFn: () => checkNameAvailable(accountId, debouncedName),
    enabled: debouncedName.length > 0,
    retry: false,
    staleTime: 30000, // Consider data fresh for 5 seconds
  })
}
