import { CreateApiForm } from './CreateApiForm'
import { CopySpreadsheetContentButton } from './CopySpreadsheetButton'

export interface FirstApiSplashProps {
  accountId: string
}

export const FirstApiSplash = ({ accountId }: FirstApiSplashProps) => {
  return (
    <div className="flex margin-auto mt-24 rounded-lg w-fit ">
      <div className="flex flex-col">
        <h2 className={`text-3xl font-medium py-1 text-primary`}>
          Let&apos;s create our first API
        </h2>
        <p>
          Following the steps below, we&apos;ll create a new API from a Google
          Sheet with sample data.
        </p>
        <ol className="list-decimal space-y-1 pl-4 pt-4">
          <li>
            <div>
              <CopySpreadsheetContentButton />
            </div>
          </li>
          <li>
            <a
              href="https://sheets.new"
              target="_blank"
              className="font-medium text-blue-600 dark:text-blue-500 hover:no-underline underline flex flex-row"
            >
              <span className="pr-2">Create a new Google Sheet</span>
              <ArrowIcon />
            </a>
          </li>
          <li>Give your spreadsheet a name and paste the content into it</li>
          <li>
            <div className="flex flex-col space-y-1.5">
              <span>Copy the Google Sheet URL and create your API</span>
              <CreateApiForm showLabel={false} accountId={accountId} />
              <span className="max-w-96 text-xs text-gray-600 pt-2">
                Important: Once an API is created, the data in your Google Sheet
                becomes publicly accessible.{' '}
                <span className="italic">
                  Only use non-sensitive information in your source
                  spreadsheets.
                </span>
              </span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="black"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
    />
  </svg>
)
