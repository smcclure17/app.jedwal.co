import { updatePostSlug } from '@/data/fetchers'
import { PostMetadata } from '@/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Checkmark } from '../Checkmark'
import { Spinner } from '../Spinner'

export interface PostSlugProps {
  accountId: string
  postId: string
  initialSlug: string
}

export default function PostSlug({
  accountId,
  postId,
  initialSlug,
}: PostSlugProps) {
  const [slug, setSlug] = useState(initialSlug)
  const [showSuccess, setShowSuccess] = useState(false)
  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: (slug: string) => updatePostSlug(accountId, postId, slug),
    onMutate: async (newSlug) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])

      // Optimistically update
      queryClient.setQueryData(['posts', accountId], (old: PostMetadata[]) => {
        return old.map((post) =>
          post.doc_api_name === postId ? { ...post, slug: newSlug } : post,
        )
      })

      return { previousPosts }
    },
    onError: (_err, _newCategory, context) => {
      queryClient.setQueryData(['posts', accountId], context?.previousPosts)
      alert('Failed to update slug :/')
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
    onSuccess: () => {
      setShowSuccess(true)
    },
  })

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleAdd = () => {
    if (!slug.trim()) return
    addCategoryMutation.mutate(slug)
  }

  return (
    <div className="flex gap-2 items-center max-w-96">
      <Input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border text-xs"
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        disabled={addCategoryMutation.isPending}
      />
      <Button
        variant="outline"
        onClick={handleAdd}
        className="border min-w-[96px]" // whatever width fits your longest state
        disabled={addCategoryMutation.isPending}
      >
        {addCategoryMutation.isPending && <Spinner srText="updating" />}
        {showSuccess && <Checkmark size={4} />}
        {!addCategoryMutation.isPending && !showSuccess && 'Update'}
      </Button>
    </div>
  )
}
