import { createAdminApiClient } from '@shopify/admin-api-client'
import { API_VERSION, storeDomain } from './data'
import { REQUEST_RETRIES } from '@/data'
import { env } from '@/utils'

export const ACCESS_TOKEN = env('SHOPIFY_ACCESS_TOKEN')

export const client = createAdminApiClient({
  apiVersion: API_VERSION,
  storeDomain,
  accessToken: ACCESS_TOKEN,
  retries: REQUEST_RETRIES - 1,
})
