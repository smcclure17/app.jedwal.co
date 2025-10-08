import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouteComponent,
  RouterProvider,
} from '@tanstack/react-router'
import { NotLoggedInScreen } from './NotLoggedInScreen'

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
  title: 'NotLoggedInScreen',
  component: NotLoggedInScreen,
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
} satisfies Meta<typeof NotLoggedInScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
