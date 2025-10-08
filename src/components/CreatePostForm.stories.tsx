import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreatePostForm } from './CreatePostForm'

// Create a QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta = {
  title: 'CreatePostForm',
  component: CreatePostForm,
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
} satisfies Meta<typeof CreatePostForm>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    accountId: '108943681286824030000',
  },
}

export const Disabled: Story = {
  args: {
    accountId: 'abc',
    disabled: true,
  },
}
