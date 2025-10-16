import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrganization, deleteOrganization } from '@/data/fetchers'

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; emails: string[] }) =>
      createOrganization(data.name, data.emails),
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
