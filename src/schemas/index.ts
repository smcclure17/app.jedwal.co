import type { components } from './api-schema'

export type PostCreateResponse = components['schemas']['PostCreateRead']
export type Post = components['schemas']['PostRead']

export type AccountRead = components['schemas']['AccountRead']

export type Api = components['schemas']['ApiRead']
export type ApiCreateResponse = components['schemas']['ApiCreateRead']

export type Webhooks = components['schemas']['WebhooksRead']
export type ApiInvocationResponse = components['schemas']['AnalyticsLogRead']

export type ApiWatchChannel = components['schemas']['ApiWatchChannelRead']
export type ApiWatchChannelCreate =
  components['schemas']['ApiWatchChannelCreate']
