export interface CheckmarkProps {
  size?: number
  color?: string
}

export function Checkmark({ size, color }: CheckmarkProps) {
  const iconSize = size ?? 2
  const iconColor = color ?? 'currentColor'

  return (
    <svg
      className={`w-${iconSize} h-${iconSize}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        stroke={iconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M1 5.917 5.724 10.5 15 1.5"
      />
    </svg>
  )
}
