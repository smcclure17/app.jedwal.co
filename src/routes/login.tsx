import { NotLoggedInScreen } from '@/components/NotLoggedInScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: 'Jedwal -- Login' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <NotLoggedInScreen />
}
