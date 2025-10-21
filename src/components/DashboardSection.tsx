export const DashboardSection = ({
  title,
  children,
  subTitle,
}: {
  title: string
  children: React.ReactNode
  subTitle?: string
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <h4 className="text-h4">{title}</h4>
      {subTitle && <p className="text-xs text-gray-700">{subTitle}</p>}
      {children}
    </div>
  )
}
