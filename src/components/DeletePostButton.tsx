import { deletePost } from '@/data/fetchers'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface DeleteDocApiButtonProps {
  accountId: string
  postId: string
}

export const DeletePostButton = ({
  postId,
  accountId,
}: DeleteDocApiButtonProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deletePost(accountId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', accountId] })
      navigate({ to: '/$accountId/posts', params: { accountId } })
    },
    onError: () => {
      alert('Failed to delete API. Please try again later.')
    },
  })

  const handleDeleteApi = () => {
    const isConfirmed = confirm(
      `Are you sure you want to delete the post /${accountId}/${postId}? This action cannot be undone.`,
    )

    if (isConfirmed) {
      mutation.mutate()
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
