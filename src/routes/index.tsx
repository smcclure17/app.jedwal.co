import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUserData } from '@/hooks/use-user'
import { useEffect } from 'react'
import { Spinner } from '@/components/Spinner'
import { NotLoggedInScreen } from '@/components/NotLoggedInScreen'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Jedwal -- Home' }],
  }),
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useUserData()

  useEffect(() => {
    if (isLoading) return
    if (user) {
      navigate({ to: `/$accountId`, params: { accountId: user.id } })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner srText="Loading user..." />
      </div>
    )
  }

  if (!user) {
    return <NotLoggedInScreen />
  }

  return null // in practice, redirect happens before render
}
