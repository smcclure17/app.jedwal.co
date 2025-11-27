import { Plug2, FileText } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import type { AccountRead, Api, Post } from '@/schemas'

interface LandingScreenContentProps {
  user: AccountRead
  posts: Array<Post>
  apis: Array<Api>
}

export function LandingScreenContent({
  user,
  posts,
  apis,
}: LandingScreenContentProps) {
  const postsCount = posts.length
  const apisCount = apis.length
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link to="/$accountId/posts" params={{ accountId: user.id }}>
        <Card className="border rounded-sm hover:bg-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Posts</CardTitle>
              </div>
              <span className="text-2xl font-bold">{postsCount}</span>
            </div>
            <CardDescription>Publish content from Google Docs</CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link to="/$accountId/apis" params={{ accountId: user.id }}>
        <Card className="border rounded-sm hover:bg-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plug2 className="h-5 w-5 text-primary" />
                <CardTitle>APIs</CardTitle>
              </div>
              <span className="text-2xl font-bold">{apisCount}</span>
            </div>
            <CardDescription>Create APIs from Google Sheets</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}
