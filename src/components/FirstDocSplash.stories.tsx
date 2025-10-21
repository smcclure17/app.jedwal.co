import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FirstDocSplash } from './FirstDocSplash'

// Create a QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta = {
  title: 'FirstDocSplash',
  component: FirstDocSplash,
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
} satisfies Meta<typeof FirstDocSplash>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    accountId: "abc"
  },
}
