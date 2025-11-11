import { useEffect, useState } from 'react'
import { CopyableSnippet } from '../CopyableSnippet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWorksheetNames } from '@/hooks/use-apis'

interface ApiCopyableSnippetProps {
  base: string
  accountId: string
  postId: string
}

export function ApiCopyableSnippet({
  base,
  accountId,
  postId,
}: ApiCopyableSnippetProps) {
  const { data: worksheets, isLoading } = useWorksheetNames(accountId, postId)
  const worksheetList = worksheets?.worksheets ?? []

  const [worksheet, setWorksheet] = useState<string | undefined>(
    worksheetList[0],
  )

  useEffect(() => {
    if (worksheetList.length > 0 && !worksheet) {
      setWorksheet(worksheetList[0])
    }
  }, [worksheetList, postId])

  const disabled = worksheetList.length <= 1 || isLoading
  const wsText = worksheet === 'Sheet1' ? '' : `?worksheet=${worksheet}`
  const urlText = `${base}${wsText}`

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm">Select a worksheet</span>

      <Select
        onValueChange={(e) => setWorksheet(e)}
        value={worksheet}
        disabled={disabled}
      >
        <SelectTrigger className="w-36">
          <SelectValue
            placeholder={isLoading ? 'Loading...' : worksheet || 'Select'}
          />
        </SelectTrigger>
        <SelectContent>
          {worksheetList?.map((ws: any) => (
            <SelectItem key={ws} value={ws}>
              {ws}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CopyableSnippet text={urlText} />
    </div>
  )
}
