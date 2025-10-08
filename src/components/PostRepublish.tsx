import { republishPost } from '@/data/fetchers'
import { Button } from './ui/button'
import { Spinner } from './Spinner'
import { Checkmark } from './Checkmark'
import { useState } from 'react'
import { RefreshIcon } from './RefreshIcon'

export interface PostRepublishProps {
  accountId: string
  postId: string
}

type StatusType = 'static' | 'updating' | 'success'

export default function PostRepublish({
  accountId,
  postId,
}: PostRepublishProps) {
  const [status, setStatus] = useState<StatusType>('static')

  const handleUpdate = async () => {
    try {
      setStatus('updating')
      await republishPost(accountId, postId)
      setStatus('success')
      setTimeout(() => setStatus('static'), 2000)
    } catch {
      alert('Failed to republish post. Please try again later.')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleUpdate}
      className="w-fit flex items-center gap-2"
    >
      <span className="w-4 h-4 flex items-center justify-center">
        {status === 'static' && <RefreshIcon />}
        {status === 'success' && <Checkmark />}
        {status === 'updating' && <Spinner srText="republishing" />}
      </span>
      Republish Post
    </Button>
  )
}
