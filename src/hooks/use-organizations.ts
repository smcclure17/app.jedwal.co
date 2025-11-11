import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createOrganization,
  deleteOrganization,
  getOrganizationMembers,
  getOrganizations,
} from '@/data/fetchers'

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { accountId: string; name: string; emails: Array<string> }) =>
      createOrganization(data.accountId, data.name, data.emails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultUser'] })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orgId: string) => deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultUser'] })
    },
  })
}

export function useOrganizations(accountId?: string) {
  return useQuery({
    queryKey: ['organizations', accountId],
    queryFn: () => getOrganizations(accountId ?? ''),
    initialData: null,
    enabled: !!accountId, // Only run when accountID is defined (it might not be on first render)
  })
}

export function useOrganizationMembers(accountId: string, orgId: string) {
  return useQuery({
    queryKey: ['memberships', accountId, orgId],
    queryFn: () => getOrganizationMembers(accountId, orgId),
    initialData: null,
    enabled: !!accountId, // Only run when accountID is defined (it might not be on first render)
  })
}
