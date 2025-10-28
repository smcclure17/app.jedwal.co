import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PostDocCreatePreview } from './PostDocCreatePreview'
import { Spinner } from '@/components/Spinner'
import { useCheckNameAvailable } from '@/hooks/use-check-name-available'
import { useState } from 'react'

interface CreatePostModalPostsProps {
  title: string
  url: string
  accountId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (slug: string) => void
  isLoading?: boolean
}

export function CreatePostModal({
  title,
  url,
  accountId,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreatePostModalPostsProps) {
  const [slug, setSlug] = useState(toSlug(title))
  const { data: isAvailable, isLoading: isCheckingAvailability } =
    useCheckNameAvailable(accountId, slug)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isAvailable) return
    onSubmit(slug)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Your Post</DialogTitle>
            <DialogDescription>
              Choose a unique URL path for your post. This will determine where
              your post is published.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label
                htmlFor="post-slug-input"
                className="flex flex-col items-start"
              >
                <p>Post URL Path (slug)</p>
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and hyphens only.
                </p>
              </Label>
              <div className="flex flex-col space-y-1">
                <Input
                  id="post-slug-input"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="font-mono text-sm"
                  required
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2 text-xs min-h-[1rem]">
                  {!isCheckingAvailability && isAvailable === false && (
                    <span className="text-red-600">
                      Post name taken. Please try another
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Converting this Google Doc</Label>
              <PostDocCreatePreview title={title} url={url} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !isAvailable || isCheckingAvailability}
            >
              {isLoading ? <Spinner srText="Creating..." /> : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function toSlug(text: string | undefined | null): string {
  if (!text) return ''
  return (
    text
      .toLowerCase()
      // replace non-alphanumeric chars with hyphen
      .replace(/[^a-z0-9]+/g, '-')
      // remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  )
}
