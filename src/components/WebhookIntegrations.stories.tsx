import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { WebhookIntegrations } from './WebhookIntegrations'
import type {
  RouteComponent} from '@tanstack/react-router';
import type { Meta, StoryObj } from '@storybook/react-vite'

// Create a QueryClient for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Create a mock router for Storybook that wraps the Story component
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
  title: 'WebhookIntegrations',
  component: WebhookIntegrations,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const mockRouter = createMockRouter(() => (
        <QueryClientProvider client={queryClient}>
          <div className="w-sm">
            <Story />
          </div>
        </QueryClientProvider>
      ))

      return <RouterProvider router={mockRouter} />
    },
  ],
} satisfies Meta<typeof WebhookIntegrations>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    accountId: 'abc',
    apiName: 'turmeric-spice',
    webhooks: [
      {
        method: 'GET',
        name: 'my hook',
        payload: {},
        url: 'https://vercel.app/integrations/v1/build-hook?id=12rwadf212rf2fwdsafsdf23',
      },
    ],
  },
}
