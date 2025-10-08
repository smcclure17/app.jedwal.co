import { PostMetadata } from '@/schemas'
import { Badge } from './ui/badge'

export function PostsListTableCell({ row }: { row: PostMetadata }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between space-x-4 text-sm">
        <div>{row.title}</div>
        <div className="font-accent text-primary whitespace-nowrap text-md">
          /{row.doc_api_name}/
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        {row.categories?.map((cat: string) => (
          <Badge variant={'outline'}>{cat}</Badge>
        ))}
      </div>
    </div>
  )
}
