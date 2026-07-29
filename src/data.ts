import 'dotenv/config'

export const RETRIES = parseInt(process.env.RETRIES ?? '1')
export const REPOSITORY_URL = process.env.GITHUB_REPOSITORY_URL ?? ''

export const MAX_RETRIES = 10

export const REQUEST_RETRIES = 3
export const REQUEST_RETRY_DELAY = 2000

export const TRANSIENT_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504]
export const TRANSIENT_ERROR_CODES = [
  'ECONNABORTED',
  'ECONNREFUSED',
  'ECONNRESET',
  'EAI_AGAIN',
  'ENOTFOUND',
  'EPIPE',
  'ETIMEDOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]
