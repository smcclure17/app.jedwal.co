import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LastRepublishedSnippet } from './LastRepublishedSnippet'
import type { Meta, StoryObj } from '@storybook/react-vite'

// Create a QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta = {
  title: 'LastRepublishedSnippet',
  component: LastRepublishedSnippet,
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
} satisfies Meta<typeof LastRepublishedSnippet>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    lastModifiedIso: new Date().toISOString(), // right now
  },
}

export const Old: Story = {
  args: {
    lastModifiedIso: new Date('2020-01-01T00:00:00Z').toISOString(),
  },
}

export const FewWeeks: Story = {
  args: {
    lastModifiedIso: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 21,
    ).toISOString(),
  },
}

export const FewHours: Story = {
  args: {
    lastModifiedIso: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
}
