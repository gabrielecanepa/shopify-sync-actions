import 'dotenv/config'

export const RETRIES = parseInt(process.env.RETRIES ?? '1')
export const REPOSITORY_URL = process.env.GITHUB_REPOSITORY_URL ?? ''

export const MAX_RETRIES = 10
