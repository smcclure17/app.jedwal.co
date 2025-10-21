import { Image } from '@unpic/react'

export const NotFoundScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2 pb-32">
      <Image
        src="/logo-cropped.svg"
        width={120}
        height={120}
        alt="Jedwal logo"
        className="mb-4"
      />

      <h2 className={`text-2xl text-[#005430] text-center`}>
        These are not the sheets you're looking for
      </h2>

      <div className="flex flex-col space-y-6 items-center">
        <span className="text-gray-700">404 - Page not found</span>
        <a
          href="https://app.jedwal.co"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Return to Home Page
        </a>
      </div>
    </div>
  )
}
