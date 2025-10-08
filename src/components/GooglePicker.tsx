import { useGooglePickerToken } from '@/hooks/data'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Spinner } from '@/components/Spinner'
import '@googleworkspace/drive-picker-element'

const events = [
  'picker:oauth:error',
  'picker:oauth:response',
  'picker:picked',
  'picker:canceled',
]

export interface GooglePickerProps {
  isOpen: boolean
  onClose: () => void
  onAuth: (event: any) => void
  fileId: string
  fetcher: (googleId: string) => Promise<any>
  token?: string
  disabled?: string
}

const GooglePickerClient = ({
  fetcher,
  isOpen,
  fileId,
  onClose,
  token,
  onAuth,
}: GooglePickerProps) => {
  const pickerRef = useRef<any>(null)

  useEffect(() => {
    if (!pickerRef.current) return

    const handleEvent = async (e: any) => {
      if (e.type === 'picker:picked') {
        try {
          onClose()
          await fetcher(e.detail.docs[0].id)
        } catch (error) {
          console.error('Failed to create API:', error)
        }
      }

      if (e.type === 'picker:canceled') {
        onClose()
      }

      if (e.type === 'picker:oauth:response') {
        onAuth(e)
      }
    }

    events.forEach((event) =>
      pickerRef.current.addEventListener(event, handleEvent),
    )

    return () => {
      if (pickerRef.current) {
        events.forEach((event) =>
          pickerRef.current.removeEventListener(event, handleEvent),
        )
      }
    }
  }, [fetcher, onAuth, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div>
      {/* @ts-ignore */}
      <drive-picker
        ref={pickerRef}
        client-id="293432620407-osstrkdh0garuvogej84muq2tcbu35bk.apps.googleusercontent.com"
        app-id="293432620407"
        origin={window.location.origin}
        oauth-token={token}
      >
        {/* @ts-ignore */}
        <drive-picker-docs-view mode="LIST" file-ids={fileId} />
        {/* @ts-ignore */}
      </drive-picker>
    </div>
  )
}

export const GooglePicker = ({
  fileId,
  fetcher,
  disabled = false,
}: {
  accountId: string
  fileId: string
  fetcher: (googleId: string) => Promise<any>
  disabled?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { accessToken, handleAuth } = useGooglePickerToken()

  const handleClose = () => setIsOpen(false)
  const handleToggle = () => setIsOpen((prev) => !prev)

  return (
    <>
      <Button
        variant={'default'}
        className='font-accent'
        onClick={handleToggle}
        disabled={disabled || fileId === ''}
      >
        {isOpen ? <Spinner srText="Creating..." /> : 'Create'}
      </Button>
      <GooglePickerClient
        fetcher={fetcher}
        fileId={fileId}
        isOpen={isOpen}
        onClose={handleClose}
        token={accessToken}
        onAuth={handleAuth}
      />
    </>
  )
}
