import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouteComponent,
  RouterProvider,
} from '@tanstack/react-router'
import { PostsList } from './PostsList'

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
  title: 'PostsList',
  component: PostsList,
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
} satisfies Meta<typeof PostsList>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    accountId: 'abc',
    selectedPostId: 'turmeric-spice',
    posts: [
      {
        doc_api_name: 'ginger-root',
        owner_id: '108943681286824037558',
        google_doc_id: '17vLCQgnoOHC7oqorw2z5mNgmMANEQS8WUjZnuiigW_A',
        frozen: false,
        created_at: '',
        title: 'This is My Google Doc With a Very Long Name That Goes On',
        last_modified: '',
        categories: ['metro', 'fun', 'non-blocking'],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'turmeric-spice',
        owner_id: '108943681286824037559',
        google_doc_id: '28wMDRhopPID8pqpsxA6oOohnOBOFRT9XVkAovijhX_B',
        frozen: false,
        created_at: '',
        title: 'Another Important Document',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
    ],
  },
}

export const Lots: Story = {
  args: {
    accountId: 'abc',
    selectedPostId: 'turmeric-spice',
    posts: [
      {
        doc_api_name: 'ginger-root',
        owner_id: '108943681286824037558',
        google_doc_id: '17vLCQgnoOHC7oqorw2z5mNgmMANEQS8WUjZnuiigW_A',
        frozen: false,
        created_at: '',
        title: 'This is My Google Doc With a Very Long Name That Goes On',
        last_modified: '',
        categories: ['metro', 'fun', 'non-blocking'],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'turmeric-spice',
        owner_id: '108943681286824037559',
        google_doc_id: '28wMDRhopPID8pqpsxA6oOohnOBOFRT9XVkAovijhX_B',
        frozen: false,
        created_at: '',
        title: 'Another Important Document',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
      {
        doc_api_name: 'cinnamon-stick',
        owner_id: '108943681286824037560',
        google_doc_id: '39xNESipqQJE9rqrtxB7pPpioPCPGSU0YWlBpwjkiY_C',
        frozen: true,
        created_at: '',
        title: 'Project Requirements Doc',
        last_modified: '',
        categories: [],
        slug: null,
        webhooks: [],
      },
    ],
  },
}
