import { ApisMetadata } from '@/schemas'
import { ApisListTable } from './ApisListTable'

export interface PostsListProps {
  accountId: string
  posts: ApisMetadata
  selectedPostId?: string
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

export function ApisList({ accountId, posts, selectedPostId }: PostsListProps) {
  console.log(posts)
  if (posts.results.length === 0) {
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
      </div>
    </div>
  )
}
