import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreatePostModal } from './CreatePostModal'

// Create a QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta = {
  title: 'CreatePostModal',
  component: CreatePostModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="min-w-xl">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof CreatePostModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    title: 'This is my Google Doc',
    url: 'https://documents.google.com/doc/v1/dwfadfdsafdfasgfsdfda',
    open: true,
    onOpenChange: (open) => console.log('Dialog open state:', open),
    onSubmit: (slug) => console.log('Submitted slug:', slug),
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    title: 'This is my Google Doc',
    url: 'https://documents.google.com/doc/v1/dwfadfdsafdfasgfsdfda',
    open: true,
    onOpenChange: (open) => console.log('Dialog open state:', open),
    onSubmit: (slug) => console.log('Submitted slug:', slug),
    isLoading: true,
  },
}