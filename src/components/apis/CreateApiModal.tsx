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
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/Spinner'
import { FileSpreadsheet } from 'lucide-react'

interface CreateApiModalProps {
  title: string
  url: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: () => void
  isLoading?: boolean
}

export function CreateApiModal({
  title,
  url,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateApiModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Your API</DialogTitle>
            <DialogDescription>
              Create a JSON API from this Google Sheet. Your API will be
              automatically generated and ready to use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Converting this Google Sheet</Label>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 max-w-xl">
                <div className="mt-0.5 flex-shrink-0">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium text-sm text-foreground truncate">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {url}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner srText="Creating..." /> : 'Create API'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
