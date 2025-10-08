import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchUserData } from '@/data/fetchers'
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
  const { data: user, isLoading } = useQuery({
    queryKey: ['defaultUser'],
    queryFn: () => fetchUserData(),
    retry: false, // don’t loop endlessly if unauthenticated
  })

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
