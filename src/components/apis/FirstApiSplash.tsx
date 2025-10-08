import { CreateApiForm } from './CreateApiForm'
import { CopySpreadsheetContentButton } from './CopySpreadsheetButton'

export interface FirstApiSplashProps {
  accountId: string
}

export const FirstApiSplash = async ({ accountId }: FirstApiSplashProps) => {
  return (
    <div className="flex margin-auto mt-24 rounded-lg w-fit ">
      <div className="flex flex-col">
        <h1 className={`font-accent text-4xl text-[#005430]`}>
          Welcome to Jedwal APIs!
        </h1>
        <p>
          Jedwal takes your Google Sheets and turns them into
          publicly-accessible JSON REST APIs.
        </p>
        <h2 className={`font-accent text-2xl pt-5 text-[#005430]`}>
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
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline flex flex-row"
            >
              <span className="pr-2">Create a new Google Sheet</span>
              <ArrowIcon />
              <GoogleSheetIcon />
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

const GoogleSheetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="25"
    height="25"
    viewBox="0 0 48 48"
  >
    <path
      fill="#43a047"
      d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"
    ></path>
    <path fill="#c8e6c9" d="M40 13L30 13 30 3z"></path>
    <path fill="#2e7d32" d="M30 13L40 23 40 13z"></path>
    <path
      fill="#e8f5e9"
      d="M31,23H17h-2v2v2v2v2v2v2v2h18v-2v-2v-2v-2v-2v-2v-2H31z M17,25h4v2h-4V25z M17,29h4v2h-4V29z M17,33h4v2h-4V33z M31,35h-8v-2h8V35z M31,31h-8v-2h8V31z M31,27h-8v-2h8V27z"
    ></path>
  </svg>
)

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
