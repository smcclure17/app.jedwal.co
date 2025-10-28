import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Spinner } from '@/components/Spinner'
import { NotLoggedInScreen } from '@/components/NotLoggedInScreen'
import { GenericMessageScreen } from '@/components/GenericMessageScreen'
import { createCheckout } from '@/data/fetchers'

export const Route = createFileRoute('/create-checkout')({
  head: () => ({
    meta: [{ title: 'Jedwal -- Create Checkout' }],
  }),
  component: App,
})

function App() {
  const mutation = useMutation({
    mutationFn: createCheckout,
    onSuccess: (url: string) => {
      // Redirect to the checkout URL
      window.location.href = url
    },
  })

  useEffect(() => {
    mutation.mutate()
  }, [])

  if (mutation.isPending) {
    return (
      <GenericMessageScreen
        title="Creating checkout session..."
        message={<Spinner srText="Redirecting to checkout..." />}
        showHomeLink={false}
      />
    )
  }

  if (mutation.isError) {
    const error = mutation.error as Error

    if (error.message === 'User Not Logged In') {
      return (
        <NotLoggedInScreen message="Please sign in to upgrade your account" />
      )
    }

    // Handle other errors
    return (
      <GenericMessageScreen
        title="Checkout Failed"
        message="We couldn't create your checkout session. Please try again later."
      />
    )
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner srText="Redirecting to checkout..." />
    </div>
  )
}
