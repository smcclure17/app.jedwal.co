import { Image } from '@unpic/react'

export interface GenericMessageScreenProps {
  title?: string
  showHomeLink?: boolean
  message?: string | React.ReactNode
}

export const GenericMessageScreen = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  showHomeLink = true,
}: GenericMessageScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2 pb-32">
      <Image
        src="/logo-cropped.svg"
        width={120}
        height={120}
        alt="Jedwal logo"
        className="mb-4"
      />

      <h2 className={`text-2xl text-primary text-center`}>{title}</h2>

      <p className="text-gray-600 text-center max-w-md">{message}</p>

      {showHomeLink && (
        <div className="flex flex-col space-y-4 items-center pt-4">
          <a
            href="https://app.jedwal.co"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Return to Home Page
          </a>
        </div>
      )}
    </div>
  )
}
