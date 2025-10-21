import { createFileRoute } from '@tanstack/react-router'
import { useUserData } from '@/hooks/use-user'
import { usePosts } from '@/hooks/use-posts'
import { useApis } from '@/hooks/use-apis'
import { LandingScreenContent } from '@/components/landing/LandingScreenContent'
import { GetStartedScreen } from '@/components/landing/GetStartedScreen'
import { WelcomeBanner } from '@/components/landing/WelcomeBanner'
import { WelcomeBannerSkeleton } from '@/components/landing/WelcomeBannerSkeleton'
import { LandingScreenSkeleton } from '@/components/landing/LandingScreenSkeleton'

export const Route = createFileRoute('/_dashboard/$accountId/')({
  component: DashboardHome,
})

function DashboardHome() {
  const { accountId } = Route.useParams()
  const { data: user } = useUserData()
  const { data: posts } = usePosts(accountId)
  const { data: apis } = useApis(accountId)

  // Show skeleton while loading
  if (!user || posts === null || apis === null) {
    return (
      <div className='max-w-3xl mx-auto flex flex-col justify-center min-h-[calc(100vh-200px)]'>
        <WelcomeBannerSkeleton />
        <LandingScreenSkeleton />
      </div>
    )
  }

  const postsCount = posts?.length ?? 0
  const apisCount = apis?.results.length ?? 0
  const hasContent = postsCount > 0 || apisCount > 0

  // Get user's display name
  const displayName = user?.display_name.split(' ')[0] || 'there'

  if (hasContent) {
    return (
      <div className='max-w-3xl mx-auto flex flex-col justify-center min-h-[calc(100vh-200px)]'>
        <WelcomeBanner
          displayName={displayName}
          subText="Welcome back to your workspace."
        />
        <LandingScreenContent user={user} posts={posts} apis={apis} />
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto flex flex-col justify-center min-h-[calc(100vh-200px)]'>
      <WelcomeBanner
        displayName={displayName}
        subText="Welcome to Jedwal."
      />
      <GetStartedScreen accountId={accountId} />
    </div>
  )
}
