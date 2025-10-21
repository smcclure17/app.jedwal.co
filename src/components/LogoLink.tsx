import { Image } from '@unpic/react'

export const LogoLink = ({
  size = 'default',
}: {
  size?: 'default' | 'small'
}) => {
  const height = size === 'default' ? 30 : 20
  const width = height
  const textSize = size === 'default' ? '3xl' : '2xl'
  const dotCoSize = size === 'default' ? 'xl' : 'lg'

  return (
    <a href="https://jedwal.co">
      <div className="flex flex-row space-x-1 w-fit">
        <Image
          src="/logo-cropped.svg"
          height={height}
          width={width}
          alt="logo with stars"
        ></Image>
        <div className="items-center">
          <span className={`font-accent text-${textSize} text-primary`}>
            Jedwal.
          </span>
          <span className={`text-${dotCoSize} text-primary`}>co</span>
        </div>
      </div>
    </a>
  )
}
