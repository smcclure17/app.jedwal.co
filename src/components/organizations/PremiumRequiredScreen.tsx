import { Image } from '@unpic/react'
import { Link } from '@tanstack/react-router'

export const PremiumRequiredScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2 pb-32">
      <Image
        src="/logo-cropped.svg"
        width={120}
        height={120}
        alt="Jedwal logo"
        className="mb-4"
      />

      <h2 className={`text-2xl text-primary text-center`}>
        Only premium users can create organizations
      </h2>

      <p className="text-gray-600 text-center max-w-md">
        Upgrade to premium to create organizations and collaborate with your team.
      </p>

      <div className="flex flex-col space-y-4 items-center pt-4">
        <a
          href="https://jedwal.co/pricing"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-[#004020] transition-colors font-medium"
        >
          Upgrade Now
        </a>
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  )
}
