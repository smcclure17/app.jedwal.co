// src/contexts/AuthContext.tsx
import config from '@/config'
import { UserDataResponse } from '@/schemas'
import React, { createContext, useContext, useEffect, useState } from 'react'


interface AuthState {
  user: UserDataResponse | null
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
    const query = accountId
      ? `?account_id=${encodeURIComponent(accountId)}`
      : ''
    fetch(`${config.api.url}/get-account-data${query}`, {
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
