import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import config from '@/config'

async function checkNameAvailable(
  accountId: string,
  name: string,
): Promise<boolean> {
  const url = `${config.api.url}/doc/check-name-available?owner_id=${accountId}&api_name=${name}`
  const response = await fetch(url, { credentials: 'include' })

  if (!response.ok) {
    throw new Error(`Failed to check name availability: ${response.statusText}`)
  }

  const data = await response.json()
  return data.available
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
