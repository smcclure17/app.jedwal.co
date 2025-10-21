import { FileText, ArrowRight, Database } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Link } from '@tanstack/react-router'
import { ApisMetadata, PostMetadata, UserDataResponse } from '@/schemas'

interface LandingScreenContentProps {
  user: UserDataResponse
  posts: PostMetadata[]
  apis: ApisMetadata
}

export function LandingScreenContent({
  user,
  posts,
  apis,
}: LandingScreenContentProps) {
  const postsCount = posts.length
  const apisCount = apis?.results.length + apis?.failures?.length
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className='border rounded-sm'>
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
        <CardContent>
          <Link to="/$accountId/posts" params={{ accountId: user.id }}>
            <Button variant="outline" className="w-full">
              View Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className='border rounded-sm'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>APIs</CardTitle>
            </div>
            <span className="text-2xl font-bold">{apisCount}</span>
          </div>
          <CardDescription>Create APIs from Google Sheets</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/$accountId/apis" params={{ accountId: user.id }}>
            <Button variant="outline" className="w-full">
              View APIs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
