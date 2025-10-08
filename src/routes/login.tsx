import { NotLoggedInScreen } from '@/components/NotLoggedInScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NotLoggedInScreen />
}
