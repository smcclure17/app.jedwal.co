import { Link, useParams, useRouterState } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Dynamically builds breadcrumbs based on user + route.
 * - Always shows Home
 * - Shows user (Account)
 * - Adds section (posts, apis, etc.)
 * - Adds item (postId/apiId) if present
 */
export function BreadcrumbMagic() {
  const { accountId, postId, apiId } = useParams({ strict: false })
  const { location } = useRouterState()
  const { user } = useAuth()

  const pathname = location.pathname
  const crumbs: Array<{ label: React.ReactNode; href?: string }> = []

  if (user) {
    crumbs.push({
      label: user.display_name,
      href: `/${accountId}`,
    })
  } else {
    crumbs.push({
      label: <Skeleton className="h-4 w-24 rounded" />,
    })
  }

  // Section layer: detect /posts, /apis, etc.
  const sectionMatch = pathname.match(/\/(posts|apis|settings|users|organizations)(?:\/|$)/)
  const section = sectionMatch?.[1]

  if (section) {
    crumbs.push({
      label: section.charAt(0).toUpperCase() + section.slice(1),
      href: `/${accountId}/${section}`,
    })
  }

  // Item layer (specific post/api page)
  if (postId) {
    crumbs.push({ label: postId })
  } else if (apiId) {
    crumbs.push({ label: apiId })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <BreadcrumbItem key={i}>
            {crumb.href ? (
              <BreadcrumbLink asChild>
                <Link to={crumb.href}>{crumb.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
