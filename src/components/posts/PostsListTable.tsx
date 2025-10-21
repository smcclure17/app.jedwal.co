import { PostMetadata } from '@/schemas'
import { rankItem } from '@tanstack/match-sorter-utils'
import { Link } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  FilterFn,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { PostsListTableCell } from './PostsListTableCell'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface PostsListTableProps {
  accountId: string
  posts: PostMetadata[]
  selectedPostId?: string
}

const fuzzy: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columns = [
  {
    accessorKey: 'document',
    header: 'Document',
    // @ts-ignore I can't figure out this type easily
    cell: ({ row }) => <PostsListTableCell row={row.original} />,
    filterFn: 'fuzzy',
    accessorFn: (row: PostMetadata) => {
      // Combine all searchable fields into one string for fuzzy search
      return `${row.title} ${row.doc_api_name} ${row.categories?.join(' ') || ''}`
    },
  },
]

export function PostsListTable({
  posts,
  accountId,
  selectedPostId,
}: PostsListTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Extract all unique categories from posts
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>()
    posts.forEach((post) => {
      post.categories?.forEach((cat) => categorySet.add(cat))
    })
    return Array.from(categorySet).sort()
  }, [posts])

  // Filter posts by category before passing to table
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter((post) =>
      post.categories?.includes(selectedCategory),
    )
  }, [posts, selectedCategory])

  const table = useReactTable({
    data: filteredPosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: { fuzzy },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
  })

  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        <div className="relative flex-1 flex-col">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        {allCategories.length > 0 && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="overflow-hidden">
        {table.getRowModel().rows.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {globalFilter || selectedCategory !== 'all'
              ? 'No posts match your filters'
              : 'No posts yet'}
          </div>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-gray-200 border-t">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.original.doc_api_name === selectedPostId
                      ? 'border-l-2 border-l-primary bg-gray-50'
                      : 'border-l-1 border-l-transparent'
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="w-full py-3 px-2">
                      <Link
                        to="/$accountId/posts/$postId"
                        params={{
                          accountId,
                          postId: cell.row.original.doc_api_name,
                        }}
                        className="block w-full"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
