import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { ApiWatchChannelTable } from './ApiWatchChannelTable'
import type { RouteComponent } from '@tanstack/react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ApiWatchChannel } from '@/schemas'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const createMockRouter = (StoryComponent: RouteComponent) => {
  const rootRoute = createRootRoute({
    component: StoryComponent,
  })

  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })
}

const meta = {
  title: 'APIs/ApiWatchChannelTable',
  component: ApiWatchChannelTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const mockRouter = createMockRouter(() => (
        <QueryClientProvider client={queryClient}>
          <div className="max-w-4xl">
            <Story />
          </div>
        </QueryClientProvider>
      ))

      return <RouterProvider router={mockRouter} />
    },
  ],
} satisfies Meta<typeof ApiWatchChannelTable>

export default meta
type Story = StoryObj<typeof meta>

const mockChannels: ApiWatchChannel[] = [
  {
    channel_id: 'ch_123abc',
    name: 'Production Webhook',
    webhook_url: 'https://api.vercel.com/v1/integrations/deploy-hooks/abc123',
    api_key: 'blog-api',
    owner_id: 'user-123',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    channel_id: 'ch_456def',
    name: 'Staging Webhook',
    webhook_url: 'https://api.vercel.com/v1/integrations/deploy-hooks/def456',
    api_key: 'blog-api',
    owner_id: 'user-123',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
  {
    channel_id: 'ch_789ghi',
    name: 'Analytics Update',
    webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX',
    api_key: 'blog-api',
    owner_id: 'user-123',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
]

export const WithChannels: Story = {
  args: {
    channels: mockChannels,
    onCreateChannel: (name: string, webhookUrl: string) => {
      console.log('Create channel:', { name, webhookUrl })
    },
    onDeleteChannel: (channelId: string) => {
      console.log('Delete channel:', channelId)
    },
  },
}

export const Empty: Story = {
  args: {
    channels: [],
    onCreateChannel: (name: string, webhookUrl: string) => {
      console.log('Create channel:', { name, webhookUrl })
    },
    onDeleteChannel: (channelId: string) => {
      console.log('Delete channel:', channelId)
    },
  },
}

export const SingleChannel: Story = {
  args: {
    channels: [mockChannels[0]],
    onCreateChannel: (name: string, webhookUrl: string) => {
      console.log('Create channel:', { name, webhookUrl })
    },
    onDeleteChannel: (channelId: string) => {
      console.log('Delete channel:', channelId)
    },
  },
}
