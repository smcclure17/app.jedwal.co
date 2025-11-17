import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addPostCategory,
  createPost,
  deletePost,
  fetchPosts,
  getWebhooks,
  removePostCategory,
  republishPost,
} from '@/data/fetchers'

export function usePosts(accountId: string) {
  return useQuery({
    queryKey: ['posts', accountId],
    queryFn: () => fetchPosts(accountId),
    initialData: null,
  })
}

export function useCreatePost(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ googleId, slug }: { googleId: string; slug: string }) =>
      createPost(googleId, slug, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}

export function useDeletePost(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deletePost(accountId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}

export function useRepublishPost(accountId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => republishPost(accountId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}

export function useAddPostCategory(accountId: string, postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: string) =>
      addPostCategory(accountId, postId, category),
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])

      // Optimistically update
      queryClient.setQueryData(['posts', accountId], (old: Array<any>) => {
        return old.map((post) =>
          post.post_key === postId
            ? { ...post, categories: [...(post.categories ?? []), newCategory] }
            : post,
        )
      })

      return { previousPosts }
    },
    onError: (_err, _newCategory, context) => {
      queryClient.setQueryData(['posts', accountId], context?.previousPosts)
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}

export function useRemovePostCategory(accountId: string, postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: string) =>
      removePostCategory(accountId, postId, category),
    onMutate: async (categoryToRemove) => {
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])
      queryClient.setQueryData(['posts', accountId], (old: Array<any>) => {
        return old.map((post) =>
          post.doc_api_name === postId
            ? {
                ...post,
                categories: (post.categories ?? []).filter(
                  (c: string) => c !== categoryToRemove,
                ),
              }
            : post,
        )
      })

      return { previousPosts }
    },
    onError: (_err, _categoryToRemove, context) => {
      queryClient.setQueryData(['posts', accountId], context?.previousPosts)
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}

export function useWebhooks(accountId: string, postId: string) {
  return useQuery({
    queryKey: ['webhooks', accountId, postId],
    queryFn: () => getWebhooks(accountId, postId),
    initialData: null,
  })
}
