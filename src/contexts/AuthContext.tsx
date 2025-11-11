// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AccountRead } from '@/schemas'
import config from '@/config'

interface AuthState {
  user: AccountRead | null
  isLoading: boolean
  error?: string
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({
  children,
  accountId,
}: {
  children: React.ReactNode
  accountId?: string
}) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const meUrl = `${config.api.url}/me`
    const accountUrl = `${config.api.url}/manage/${accountId}`
    const url = accountId ? accountUrl : meUrl

    fetch(url, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json()
          setAuth({ user, isLoading: false })
        } else {
          setAuth({
            user: null,
            isLoading: false,
            error: res.status === 401 ? undefined : `${res.statusText}`,
          })
        }
      })
      .catch((err) => {
        setAuth({ user: null, isLoading: false, error: err.message })
      })
  }, [accountId])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
