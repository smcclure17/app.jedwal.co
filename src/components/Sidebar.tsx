import { useAuth } from '@/contexts/authContext'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import {
  FileText,
  Plug2,
  Check,
  ChevronsUpDown,
  Sparkles,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserData } from '@/data/fetchers'
import { Badge } from './ui/badge'
import config from '@/config'
import { LogoLink } from './LogoLink'

export function Sidebar() {
  const { user, error } = useAuth()

  const { data: individualUser, isLoading } = useQuery({
    queryKey: ['defaultUser'],
    queryFn: () => fetchUserData(),
    retry: false, // don't loop endlessly if unauthenticated
  })

  const { accountId } = useParams({ strict: false })
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const accountMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  // Get current accountId from URL params or default to user id
  const currentAccountId = accountId || user?.id
  const [selectedAccountId, setSelectedAccountId] = useState(currentAccountId)

  // Update selectedAccountId when URL changes
  useEffect(() => {
    if (currentAccountId) {
      setSelectedAccountId(currentAccountId)
    }
  }, [currentAccountId])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node) &&
        !accountButtonRef.current?.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false)
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current?.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menus with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isAccountMenuOpen) {
          setIsAccountMenuOpen(false)
          accountButtonRef.current?.focus()
        }
        if (isUserMenuOpen) {
          setIsUserMenuOpen(false)
          userButtonRef.current?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isAccountMenuOpen, isUserMenuOpen])

  if (error) {
    return (
      <aside className="w-64 border-r bg-background h-screen p-4">
        <div className="text-sm">Error loading user data</div>
      </aside>
    )
  }

  const allIsLoading = !user && !error && !isLoading

  // Combine user and orgs into a single accounts list
  const allAccounts = individualUser
    ? [
        {
          id: individualUser.id,
          name: individualUser.display_name,
          email: individualUser.email,
          type: individualUser.type,
          isPremium: individualUser.account_status === 'premium',
        },
        ...(individualUser.orgs?.map((org: any) => ({
          id: org.account_id,
          name: org.display_name || org.name,
          email: org.email,
          type: 'organization',
          isPremium: org.account_status === 'premium',
        })) || []),
      ]
    : []

  const currentAccount =
    allAccounts.find((acc) => acc.id === selectedAccountId) || allAccounts[0]

  // Get user initials for avatar
  const getInitials = (name: string) => {
    try {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    } catch {
      return ''
    }
  }

  return (
    <aside className="w-64 border-r bg-background h-screen flex flex-col">
      {/* Header */}
      <div className="flex p-3 border-b">
        <div className="mx-auto">
          <LogoLink size="small" />
        </div>
      </div>

      {/* Account Selector */}
      <div className="p-2 border-b">
        {allIsLoading ? (
          <div className="animate-pulse px-2 py-2">
            <div className="h-4 w-32 bg-muted rounded mb-2"></div>
            <div className="h-3 w-24 bg-muted rounded"></div>
          </div>
        ) : (
          <div className="relative">
            <button
              ref={accountButtonRef}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent text-left transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium truncate">
                    {currentAccount?.name}
                  </div>
                  {currentAccount?.isPremium && (
                    <Badge variant={'secondary'} className="py-0">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </button>

            {/* Dropdown Menu */}
            {isAccountMenuOpen && (
              <div
                ref={accountMenuRef}
                className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 py-1"
              >
                {allAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelectedAccountId(account.id)
                      setIsAccountMenuOpen(false)
                      // Navigate to the home page of the selected account
                      navigate({
                        to: '/$accountId/posts',
                        params: { accountId: account.id },
                      })
                    }}
                    className="w-full flex items-center justify-between px-2 py-2 hover:bg-accent text-left transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium truncate">
                          {account.name}
                        </div>
                        {account.isPremium && (
                          <Badge variant={'secondary'} className="py-0">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.type === 'organization'
                          ? 'Organization'
                          : 'Personal'}
                      </div>
                    </div>
                    {selectedAccountId === account.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {allIsLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-9 bg-muted rounded-md"></div>
            <div className="h-9 bg-muted rounded-md"></div>
          </div>
        ) : (
          <>
            <Link
              to={`/$accountId/posts`}
              params={{ accountId: selectedAccountId ?? user?.id ?? '' }}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-medium"
            >
              <FileText className="h-4 w-4" />
              Posts
            </Link>
            <Link
              to={`/$accountId/apis`}
              params={{ accountId: selectedAccountId ?? user?.id ?? '' }}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-medium"
            >
              <Plug2 className="h-4 w-4" />
              APIs
            </Link>
          </>
        )}
      </nav>

      {/* User Menu at Bottom */}
      <div className="p-2 border-t mt-auto">
        {allIsLoading ? (
          <div className="animate-pulse px-2 py-2">
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ) : (
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {individualUser && getInitials(individualUser.display_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {individualUser?.display_name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {individualUser?.email}
                </div>
              </div>
            </button>

            {/* User Popover Menu */}
            {isUserMenuOpen && (
              <div
                ref={userMenuRef}
                className="absolute bottom-full left-0 right-0 mb-1 bg-popover border rounded-lg shadow-lg z-50 py-2 min-w-[240px]"
              >
                {/* User Info Header */}
                <div className="px-3 py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {individualUser &&
                        getInitials(individualUser.display_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {individualUser?.display_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {individualUser?.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Message */}
                {individualUser?.account_status === 'premium' && (
                  <div className="px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>Thanks for using Pro :)</span>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="py-1">
                  <a
                    href={`${config.api.url}/`}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent text-left transition-colors text-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    Billing Portal
                  </a>
                  <a
                    href={`${config.api.url}/logout`}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent text-left transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
