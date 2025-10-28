import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import config from '@/config'

async function checkOrgNameAvailable(name: string): Promise<boolean> {
  const url = `${config.api.url}/organization/check-name-available?organization_name=${name}`
  const response = await fetch(url, { credentials: 'include' })

  if (!response.ok) {
    throw new Error(`Failed to check org name availability: ${response.statusText}`)
  }

  const data = await response.json()
  return data.available
}

export function useCheckOrgNameAvailable(name: string, debounceMs: number = 500) {
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
    queryFn: () => checkOrgNameAvailable(debouncedName),
    enabled: debouncedName.length > 0,
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}
