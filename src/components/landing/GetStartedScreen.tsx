import { ArrowRight, Database, FileText } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface GetStartedScreenProps {
  accountId: string
}

export function GetStartedScreen({ accountId }: GetStartedScreenProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Get Started</h2>
        <p className="text-muted-foreground mb-6">
          Choose how you'd like to begin using your workspace.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border rounded-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Create a Post</CardTitle>
            </div>
            <CardDescription className="text-base">
              Turn your Google Docs into published content. Good for blogs,
              documentation, and articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/$accountId/posts" params={{ accountId }}>
              <Button className="w-full hover:border-primary transition-colors">
                Create Your First Post
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border rounded-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Create an API</CardTitle>
            </div>
            <CardDescription className="text-base">
              Transform Google Sheets into JSON APIs. Good for data-driven
              applications and components.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/$accountId/apis" params={{ accountId }}>
              <Button className="w-full hover:border-primary transition-colors">
                Create Your First API
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
