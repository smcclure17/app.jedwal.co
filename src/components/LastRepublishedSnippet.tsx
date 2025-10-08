import { formatDistanceToNow, format } from 'date-fns'
import { Tooltip as ReactTooltip } from 'react-tooltip'

interface LastRepublishedSnippetProps {
  lastModifiedIso: string
}

export function LastRepublishedSnippet({
  lastModifiedIso,
}: LastRepublishedSnippetProps) {
  const date = new Date(lastModifiedIso)

  return (
    <>
      <ReactTooltip
        id="last-modified-tooltip"
        place="bottom"
        className="!bg-black !text-white border !opacity-90 !px-3 !py-1 !text-xs !font-semibold"
      />

      <span
        data-tooltip-id="last-modified-tooltip"
        data-tooltip-content={format(date, 'PPpp')}
        className="italic text-gray-600 text-sm underline decoration-dotted w-fit"
      >
        Last published {formatDistanceToNow(date, { addSuffix: true })}
      </span>
    </>
  )
}
