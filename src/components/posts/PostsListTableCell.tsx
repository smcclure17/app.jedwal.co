import { Badge } from '../ui/badge'
import type { Post } from '@/schemas'

export function PostsListTableCell({ row }: { row: Post }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between space-x-4 text-sm">
        <div>{row.title}</div>
        <div className="font-accent text-primary whitespace-nowrap text-md">
          /{row.post_key}/
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        {row.categories?.map((cat: string) => (
          <Badge variant={'secondary'}>{cat}</Badge>
        ))}
      </div>
    </div>
  )
}
