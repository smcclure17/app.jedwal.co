import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'

interface OrganizationCreateSuccessScreenProps {
  orgName: string
}

export const OrganizationCreateSuccessScreen = ({
  orgName,
}: OrganizationCreateSuccessScreenProps) => {
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
        Success! Your organization has been created
      </h2>

      <div className="flex flex-col space-y-6 items-center">
        <Link
          to={'/$accountId'}
          params={{ accountId: orgName }}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Take me there
        </Link>
      </div>
    </div>
  )
}
