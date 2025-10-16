import { useAddPostCategory, useRemovePostCategory } from '@/hooks/use-posts'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Spinner } from '../Spinner'
import { Checkmark } from '../Checkmark'

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

  const addCategoryMutation = useAddPostCategory(accountId, postId)
  const removeCategoryMutation = useRemovePostCategory(accountId, postId)

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

    addCategoryMutation.mutate(cat, {
      onSuccess: () => {
        setCat('')
        setShowSuccess(true)
      },
      onError: () => {
        alert('Failed to add category :/')
      },
    })
  }
  const handleRemove = (cat: string) => {
    if (confirm('are u sure u want to delete')) {
      removeCategoryMutation.mutate(cat, {
        onError: () => {
          alert('Failed to remove category :/')
        },
      })
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
