import config from '@/config'
import { useEffect, useState } from 'react'

export const useGooglePickerToken = () => {
  const [accessToken, setAccessToken] = useState<string>()

  const saveToken = async (token: string, expiresIn: number) => {
    try {
      await fetch(`${config.api.url}/google-picker-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, expires_in: expiresIn }),
        credentials: 'include',
      })
    } catch (error) {
      console.error('Failed to save token:', error)
    }
  }

  const fetchToken = async (): Promise<string | undefined> => {
    try {
      const res = await fetch(`${config.api.url}/google-picker-token`, {
        credentials: 'include',
      })

      if (res.status === 401) return undefined

      const json = await res.json()
      return json.token
    } catch (error) {
      console.error('Failed to fetch token:', error)
      return undefined
    }
  }

  useEffect(() => {
    fetchToken().then(setAccessToken)
  }, [])

  const handleAuth = (e: any) => {
    setAccessToken(e.detail.access_token)
    saveToken(e.detail.access_token, e.detail.expires_in)
  }

  return { accessToken, handleAuth }
}
