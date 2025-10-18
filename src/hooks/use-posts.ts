import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPosts,
  createPost,
  deletePost,
  republishPost,
  addPostCategory,
  removePostCategory,
  updatePostSlug,
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
    mutationFn: (googleId: string) => createPost(googleId, accountId),
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
      queryClient.setQueryData(['posts', accountId], (old: any[]) => {
        return old.map((post) =>
          post.doc_api_name === postId
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
      queryClient.setQueryData(['posts', accountId], (old: any[]) => {
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

export function useUpdatePostSlug(accountId: string, postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => updatePostSlug(accountId, postId, slug),
    onMutate: async (newSlug) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])

      // Optimistically update
      queryClient.setQueryData(['posts', accountId], (old: any[]) => {
        return old.map((post) =>
          post.doc_api_name === postId ? { ...post, slug: newSlug } : post,
        )
      })

      return { previousPosts }
    },
    onError: (_err, _newSlug, context) => {
      queryClient.setQueryData(['posts', accountId], context?.previousPosts)
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })
}
