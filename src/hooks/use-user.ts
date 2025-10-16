import { useQuery } from '@tanstack/react-query'
import { fetchUserData } from '@/data/fetchers'

export function useUserData(accountId?: string) {
  const result = useQuery({
    queryKey: accountId ? ['userData', accountId] : ['defaultUser'],
    queryFn: () => {
      return fetchUserData(accountId)
    },
    retry: false, // don't loop endlessly if unauthenticated
  })

  return result
}
