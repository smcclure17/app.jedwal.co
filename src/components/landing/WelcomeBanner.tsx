import { Image } from '@unpic/react'

interface WelcomeBannerProps {
  displayName: string
  subText: string
}

export function WelcomeBanner({ displayName, subText }: WelcomeBannerProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-2">
          <Image
            src="/logo-cropped.svg"
            height={48}
            width={48}
            alt="Jedwal logo"
          />
          <h1 className="text-4xl font-semibold text-primary">Hello, {displayName}!</h1>
        </div>
        <p className="text-muted-foreground text-lg">{subText}</p>
      </div>
    </div>
  )
}
