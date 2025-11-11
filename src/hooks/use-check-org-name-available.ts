import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import config from '@/config'

async function checkOrgNameAvailable(
  accountId: string,
  name: string,
): Promise<boolean> {
  const url = `${config.api.url}/manage/${accountId}/organizations/${name}`
  const response = await fetch(url, { credentials: 'include', method: 'HEAD' })

  if (response.status === 404) {
    return true
  } else if (response.ok) {
    return false
  }
  throw new Error('Could not check org name status')
}

export function useCheckOrgNameAvailable(
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
    queryKey: ['check-org-name-available', debouncedName],
    queryFn: () => checkOrgNameAvailable(accountId, debouncedName),
    enabled: debouncedName.length > 0,
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}
