import { useUpdatePostSlug } from '@/hooks/use-posts'
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

  const updateSlugMutation = useUpdatePostSlug(accountId, postId)

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleAdd = () => {
    if (!slug.trim()) return
    updateSlugMutation.mutate(slug, {
      onSuccess: () => {
        setShowSuccess(true)
      },
      onError: () => {
        alert('Failed to update slug :/')
      },
    })
  }

  return (
    <div className="flex gap-2 items-center max-w-96">
      <Input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border text-xs"
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        disabled={updateSlugMutation.isPending}
      />
      <Button
        variant="outline"
        onClick={handleAdd}
        className="border min-w-[96px]" // whatever width fits your longest state
        disabled={updateSlugMutation.isPending}
      >
        {updateSlugMutation.isPending && <Spinner srText="updating" />}
        {showSuccess && <Checkmark size={4} />}
        {!updateSlugMutation.isPending && !showSuccess && 'Update'}
      </Button>
    </div>
  )
}
