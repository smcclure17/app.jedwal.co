import { FileText } from 'lucide-react'

interface PostDocCreatePreviewProps {
  title: string
  url: string
}

export function PostDocCreatePreview({
  title,
  url,
}: PostDocCreatePreviewProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 max-w-xl">
      <div className="mt-0.5 flex-shrink-0">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-medium text-sm text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
      </div>
    </div>
  )
}
