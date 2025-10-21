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

interface CreatePostModalPostsProps {
  title: string
  url: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (slug: string) => void
  isLoading?: boolean
}

export function CreatePostModal({
  title,
  url,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreatePostModalPostsProps) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const slug = formData.get('slug') as string
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
              <Label htmlFor="post-slug-input">Post URL Path (slug)</Label>
              <Input
                id="post-slug-input"
                name="slug"
                defaultValue={toSlug(title)}
                className="font-mono text-sm"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens only.
              </p>
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
            <Button type="submit" disabled={isLoading}>
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
