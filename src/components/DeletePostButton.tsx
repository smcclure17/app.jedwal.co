import { useNavigate } from '@tanstack/react-router'
import { useDeletePost } from '@/hooks/use-posts'

export interface DeleteDocApiButtonProps {
  accountId: string
  postId: string
}

export const DeletePostButton = ({
  postId,
  accountId,
}: DeleteDocApiButtonProps) => {
  const navigate = useNavigate()
  const mutation = useDeletePost(accountId)

  const handleDeleteApi = () => {
    const isConfirmed = confirm(
      `Are you sure you want to delete the post /${accountId}/${postId}? This action cannot be undone.`,
    )
    if (isConfirmed) {
      mutation.mutate(postId, {
        onSuccess: () => {
          navigate({ to: '/$accountId/posts', params: { accountId } })
        },
        onError: () => {
          alert('Failed to delete API. Please try again later.')
        },
      })
    }
  }

  return (
    <button
      className="underline text-red-600 w-fit"
      onClick={handleDeleteApi}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Deleting...' : 'Delete API'}
    </button>
  )
}
