export const DashboardSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <h4 className="text-h4">{title}</h4>
      {children}
    </div>
  )
}
