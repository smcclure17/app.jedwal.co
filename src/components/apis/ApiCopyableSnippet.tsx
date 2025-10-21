import { useState, useEffect } from 'react'
import { CopyableSnippet } from '../CopyableSnippet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
interface ApiCopyableSnippetProps {
  base: string
  worksheets: string[]
}
export function ApiCopyableSnippet({
  base,
  worksheets,
}: ApiCopyableSnippetProps) {
  const defaultWorksheet = worksheets.length > 0 ? worksheets[0] : 'Sheet1'
  const disabled = worksheets.length === 1
  const [worksheet, setWorksheet] = useState(defaultWorksheet)

  // Reset worksheet when worksheets change (e.g., switching APIs)
  useEffect(() => {
    setWorksheet(defaultWorksheet)
  }, [defaultWorksheet])

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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {worksheets.map((ws) => (
            <SelectItem key={ws} value={ws}>{ws}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CopyableSnippet text={urlText} />
    </div>
  )
}
