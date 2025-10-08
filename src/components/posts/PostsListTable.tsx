import { PostMetadata } from '@/schemas'
import { rankItem } from '@tanstack/match-sorter-utils'
import { Link } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  FilterFn,
} from '@tanstack/react-table'
import { PostsListTableCell } from './PostsListTableCell'

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
  },
]

export function PostsListTable({
  posts,
  accountId,
  selectedPostId,
}: PostsListTableProps) {
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { fuzzy },
  })

  return (
    <div>
      <div className="overflow-hidden">
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
      </div>
    </div>
  )
}
