import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchApis,
  createApi,
  deleteApi,
  getApiAnalytics,
  postTtlUpdate
} from '@/data/fetchers'

export function useApis(accountId: string) {
  return useQuery({
    queryKey: ['apis', accountId],
    queryFn: () => fetchApis(accountId),
    initialData: null,
  })
}

export function useCreateApi(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (googleId: string) => createApi(googleId, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis', accountId] })
    },
  })
}

export function useDeleteApi(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (apiId: string) => deleteApi(accountId, apiId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis', accountId] })
    },
  })
}

export function useApiAnalytics(accountId: string, apiName: string) {
  return useQuery({
    queryKey: ['apiAnalytics', accountId, apiName],
    queryFn: () => getApiAnalytics(accountId, apiName),
  })
}

export function useUpdateApiTtl(accountId: string, apiName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ttl: number) => postTtlUpdate(accountId, apiName, ttl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis', accountId] })
    },
  })
}
