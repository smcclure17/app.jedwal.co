import { CreatePostForm } from './CreatePostForm'

export interface FirstApiSplashProps {
  accountId: string
}

export const FirstDocSplash = async ({ accountId }: FirstApiSplashProps) => {
  return (
    <div className="flex margin-auto mt-24 rounded-lg w-fit ">
      <div className="flex flex-col">
        <h1 className={`font-accent text-4xl text-[#005430]`}>
          Welcome to Jedwal CMS!
        </h1>
        <p>Jedwal turns your Google Docs into CMS Posts.</p>
        <h2 className={`font-accent text-2xl pt-5 text-[#005430]`}>
          Let&apos;s create our first Post
        </h2>
        <p>
          Following the steps below, we&apos;ll create a new Post from a Google
          Doc with sample data.
        </p>
        <ol className="list-decimal space-y-1 pl-4 pt-4">
          <li>
            <a
              href="https://docs.new"
              target="_blank"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline flex flex-row"
            >
              <span className="pr-2">Create a new Google Document</span>
              <ArrowIcon />
            </a>
          </li>
          <li>
            Give your document a name and add some content. Try different
            headings, lists, etc..
          </li>
          <li>
            <div className="flex flex-col space-y-1.5">
              <span>Copy the Google Doc URL and create your Post</span>
              <CreatePostForm accountId={accountId} showLabel={false} />
              <span className="max-w-96 text-xs text-gray-600 pt-2">
                Important: Once a post is created, the data in your Google
                Document becomes publicly accessible.{' '}
                <span className="italic">
                  Do not use sensitive information in your source documents.
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
