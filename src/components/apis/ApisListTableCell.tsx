
export function ApisListTableCell({ row }: { row: any }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between space-x-4 text-sm">
        <div>{row.spreadsheet_title ?? "Unknown Title"}</div>
        <div className="font-accent text-primary whitespace-nowrap text-md">
          /{row.api_key}/
        </div>
      </div>
      <div className="flex flex-row space-x-2"></div>
    </div>
  )
}
