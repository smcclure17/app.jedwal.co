import { GoogleSignInButton } from './GoogleSignInButton'
import { Image } from '@unpic/react'

export interface NotLoggedInScreenProps {
  message?: string
}

export const NotLoggedInScreen = ({
  message = 'Please sign in to access this page',
}: NotLoggedInScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2 pb-32">
      <Image
        src="/images/logo-cropped.svg"
        width={120}
        height={120}
        alt="Jedwal logo"
      />

      <h2 className={`text-2xl text-[#005430] text-center font-accent`}>
        {message}
      </h2>

      <div className="flex flex-col space-y-4 items-center">
        <GoogleSignInButton />
        <a
          href="https://jedwal.co"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Return to Home Page
        </a>
      </div>
    </div>
  )
}
