import { ApisMetadata } from '@/schemas'
import { ApisListTable } from './ApisListTable'
import { PremiumApiCard } from '../UpgradeAccountCard'

export interface PostsListProps {
  accountId: string
  posts: ApisMetadata
  selectedPostId?: string
  showPremiumCard?: boolean
}

function ApisListSkeleton() {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <tbody className="divide-y divide-gray-200 border-t">
          {[...Array(8)].map((_, index) => (
            <tr key={index} className="border-l-1 border-l-transparent">
              <td className="w-full py-3 px-2">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ApisList({ accountId, posts, selectedPostId, showPremiumCard = false }: PostsListProps) {
  if (posts.results.length === 0 || !posts.results) {
    return (
      <div className="w-72 border-b">
        <h3 className="text-h2 pb-2">Your APIs</h3>
        <div className="overflow-scroll h-[66vh]">
          <ApisListSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 border-b">
      <h3 className="text-h2 pb-2">Your APIs</h3>
      <div className="overflow-scroll h-[66vh]">
        <ApisListTable
          posts={posts}
          accountId={accountId}
          selectedPostId={selectedPostId}
        />
        {showPremiumCard && (
          <div className="p-2">
            <PremiumApiCard text={"Upgrade to create more posts"}/>
          </div>
        )}
      </div>
    </div>
  )
}
