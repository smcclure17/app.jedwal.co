import type { components } from './api-schema'

export type CreatePostResponse = components['schemas']['CreateDocResponse']
export type PostMetadata = components['schemas']['DocApiResponse']
export type PostsMetadata = components['schemas']['DocsMetadataResponse']

export type UserDataResponse = components['schemas']['UserDataResponse']

export type ApiMetadata = components['schemas']['SheetMetadata']
export type ApisMetadata = components['schemas']['GetAllSheetsResponse']

export type WebhookIntegration = components['schemas']['WebhookIntegration']
export type ApiInvocationResponse =
  components['schemas']['ApiInvocationResponse']
// export type CreateApiResponse = components['schemas']['Create']
