import { PostMetadata } from '@/schemas'
import { PostsListTable } from './PostsListTable'

export interface PostsListProps {
  accountId: string
  posts: PostMetadata[] | null
  selectedPostId?: string
}

function PostsListSkeleton() {
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

export function PostsList({
  accountId,
  posts,
  selectedPostId,
}: PostsListProps) {
  if (posts === null) {
    return (
      <div className="w-72 border-b">
        <h3 className="text-h2 pb-2">Your Posts</h3>
        <div className="overflow-scroll h-[66vh]">
          <PostsListSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 border-b">
      <h3 className="text-h2 pb-2">Your Posts</h3>
      <div className="overflow-scroll h-[66vh]">
        <PostsListTable
          posts={posts}
          accountId={accountId}
          selectedPostId={selectedPostId}
        />
      </div>
    </div>
  )
}
