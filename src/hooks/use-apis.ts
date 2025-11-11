import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createApi,
  deleteApi,
  fetchApis,
  fetchWorksheetNames,
  postTtlUpdate,
} from '@/data/fetchers/apis'

import { getAnalytics } from '@/data/fetchers'

export function useApis(accountId: string) {
  return useQuery({
    queryKey: ['apis', accountId],
    queryFn: () => fetchApis(accountId),
    initialData: null,
  })
}

export function useWorksheetNames(accountId: string, postId: string) {
  return useQuery({
    queryKey: ['worksheets', accountId, postId],
    queryFn: () => fetchWorksheetNames(accountId, postId),
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

export function useAnalytics(
  accountId: string,
  resourceType: string,
  apiName: string,
) {
  return useQuery({
    queryKey: ['analytics', resourceType, accountId, apiName],
    queryFn: () => getAnalytics(accountId, resourceType, apiName),
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
