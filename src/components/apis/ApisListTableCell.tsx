import { ApiMetadata } from '@/schemas'

export function ApisListTableCell({ row }: { row: ApiMetadata }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between space-x-4 text-sm">
        <div>{row.spreadsheet_title}</div>
        <div className="font-accent text-primary whitespace-nowrap text-md">
          /{row.sheet_api_name}/
        </div>
      </div>
      <div className="flex flex-row space-x-2"></div>
    </div>
  )
}
