import { createFileRoute } from '@tanstack/react-router'
import { NotLoggedInScreen } from '@/components/NotLoggedInScreen'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: 'Jedwal -- Login' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <NotLoggedInScreen />
}
