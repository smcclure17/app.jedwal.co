import { rankItem } from '@tanstack/match-sorter-utils'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ApisListTableCell } from './ApisListTableCell'
import type {
  FilterFn} from '@tanstack/react-table';
import type { ApisMetadata } from '@/schemas'

export interface ApisListTableProps {
  accountId: string
  posts: ApisMetadata
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
    cell: ({ row }) => <ApisListTableCell row={row.original} />,
  },
]

export function ApisListTable({
  posts,
  accountId,
  selectedPostId,
}: ApisListTableProps) {
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
                  row.original.api_key === selectedPostId
                    ? 'border-l-2 border-l-primary bg-gray-50'
                    : 'border-l-1 border-l-transparent'
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="w-full py-3 px-2">
                    <Link
                      to="/$accountId/apis/$apiId"
                      params={{
                        accountId,
                        apiId: cell.row.original.api_key,
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
