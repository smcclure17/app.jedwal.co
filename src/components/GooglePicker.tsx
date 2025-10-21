import { useGooglePickerToken } from '@/hooks/data'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Spinner } from '@/components/Spinner'

// Only import on client-side to avoid SSR issues
if (typeof window !== 'undefined') {
  import('@googleworkspace/drive-picker-element')
}

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
  onPick: any
  token?: string
  disabled?: string
}

const GooglePickerClient = ({
  onPick,
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
          const doc = e.detail.docs[0]
          onPick({
            id: doc.id,
            name: doc.name,
            url: doc.url || `https://docs.google.com/document/d/${doc.id}`,
          })
        } catch (error) {
          console.error('Failed to pick document:', error)
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
  }, [onPick, onAuth, onClose])

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
  onPick,
  disabled = false,
  submitTitle = 'Create New Post',
}: {
  accountId: string
  fileId: string
  onPick: any
  disabled?: boolean
  submitTitle?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { accessToken, handleAuth } = useGooglePickerToken()

  const handleClose = () => setIsOpen(false)
  const handleToggle = () => setIsOpen((prev) => !prev)

  return (
    <>
      <Button
        variant={'default'}
        onClick={handleToggle}
        disabled={disabled || fileId === ''}
      >
        {isOpen ? <Spinner srText="Creating..." /> : submitTitle}
      </Button>
      <GooglePickerClient
        fileId={fileId}
        isOpen={isOpen}
        onClose={handleClose}
        token={accessToken}
        onAuth={handleAuth}
        onPick={onPick}
      />
    </>
  )
}
