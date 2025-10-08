import { addPostCategory, removePostCategory } from '@/data/fetchers'
import { PostMetadata } from '@/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Spinner } from './Spinner'
import { Checkmark } from './Checkmark'

export interface PostCategoriesProps {
  accountId: string
  postId: string
  categories: any[]
}

export default function PostCategories({
  accountId,
  postId,
  categories,
}: PostCategoriesProps) {
  const [cat, setCat] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const queryClient = useQueryClient()

  const validateCategory = (category: string): string | null => {
    const trimmed = category.trim()
    if (!trimmed) return 'Category cannot be empty'
    if (!/^[a-zA-Z0-9]+$/.test(trimmed))
      return 'Category must be alphanumeric only'
    if (categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
      return 'Category already exists'
    }
    return null
  }

  const addCategoryMutation = useMutation({
    mutationFn: (category: string) =>
      addPostCategory(accountId, postId, category),
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])

      // Optimistically update
      queryClient.setQueryData(['posts', accountId], (old: PostMetadata[]) => {
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
      alert('Failed to add category :/')
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
    onSuccess: () => {
      setCat('')
      setShowSuccess(true)
    },
  })

  const removeCategoryMutation = useMutation({
    mutationFn: (category: string) =>
      removePostCategory(accountId, postId, category),
    onMutate: async (categoryToRemove) => {
      await queryClient.cancelQueries({ queryKey: ['posts', accountId] })
      const previousPosts = queryClient.getQueryData(['posts', accountId])
      queryClient.setQueryData(['posts', accountId], (old: PostMetadata[]) => {
        return old.map((post) =>
          post.doc_api_name === postId
            ? {
                ...post,
                categories: (post.categories ?? []).filter(
                  (c) => c !== categoryToRemove,
                ),
              }
            : post,
        )
      })

      return { previousPosts }
    },
    onError: (_err, _categoryToRemove, context) => {
      queryClient.setQueryData(['posts', accountId], context?.previousPosts)
      alert('Failed to remove category :/')
    },
    onSettled: () => {
      // Always refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
    },
  })

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleAdd = () => {
    if (!cat.trim()) return
    const validationError = validateCategory(cat)
    if (validationError) {
      alert(validationError)
      return
    }

    addCategoryMutation.mutate(cat)
  }
  const handleRemove = (cat: string) => {
    if (confirm('are u sure u want to delete')) {
      removeCategoryMutation.mutate(cat)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Input
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          placeholder="E.g. 'metro'"
          className="text-xs max-w-72"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          disabled={addCategoryMutation.isPending}
        />
        <Button
          variant={'ghost'}
          onClick={handleAdd}
          className="border min-w-16"
          disabled={addCategoryMutation.isPending}
        >
          {addCategoryMutation.isPending && <Spinner srText="adding" />}
          {showSuccess && <Checkmark size={4}/>}
          {!addCategoryMutation.isPending && !showSuccess && 'Add'}
        </Button>
      </div>
      <div className="flex space-x-1">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleRemove(cat)}
            className="w-fit cursor-pointer hover:opacity-75"
          >
            <Badge variant={'secondary'} className="text-sm">
              {cat}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
