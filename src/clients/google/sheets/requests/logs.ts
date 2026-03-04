import sheets, { SPREADSHEET_ID, SYNC_COLLECTIONS_STATUS_SHEET, SYNC_PRODUCTS_QUANTITY_SHEET } from '@@/google/sheets'
import { hyperlink } from '@@/google/sheets/utils'
import { ActionPayload, ActionStatus, BaseObject } from '@/types'
import { formatDate, getActionRunURL, isCI, logger, titleize } from '@/utils'

const source = isCI ? 'GitHub Actions' : 'Local'

interface syncCollectionsPayload extends ActionPayload {
  action?: 'publish' | 'unpublish'
  collection?: string
  website?: string
  products?: number
  previous?: number
  new?: number
}

interface syncCollectionsLog {
  Action?: 'Publish' | 'Unpublish' | 'None'
  Collection?: string
  Website?: string
  Products?: number
  'Previous Publications'?: number
  'New Publications'?: number
}

interface syncProductsPayload extends ActionPayload {
  product?: string
  variant?: string
  website?: string
  previous?: number
  new?: number
  delta?: number
}

interface syncProductsLog {
  Product?: string
  Variant?: string
  Website?: string
  'Previous Quantity'?: number
  'New Quantity'?: number
  Delta?: number
}

/**
 * Appends an action log with arbitrary fields to the Google Sheet.
 */
export const appendActionLog = async <T extends BaseObject>(sheet: string, payload: ActionPayload, log: T) => {
  const hasErrors = Array.isArray(payload.errors) ? !!payload.errors.length : !!payload.errors
  const event = titleize(payload.event || '', false)
  const githubRun = payload.runId ? hyperlink(getActionRunURL(payload.runId), payload.runId) : ''
  const errors = hasErrors ? JSON.stringify(payload.errors) : ''
  const values = [
    {
      Date: formatDate(),
      Status: payload.status,
      Source: source,
      Event: event,
      'GitHub Run': githubRun,
      ...log,
      Message: payload.message,
      Errors: errors,
    },
  ]
  const response = await sheets.appendRows({ spreadsheetId: SPREADSHEET_ID, sheet, values })
  if (payload.message) logger[payload.status === ActionStatus.failed ? 'error' : 'notice'](payload.message)
  return response
}

/**
 * Logs the `sync-collections` action to Google Sheets.
 */
export const logCollections = async (payload: syncCollectionsPayload) =>
  appendActionLog<syncCollectionsLog>(SYNC_COLLECTIONS_STATUS_SHEET, payload, {
    Action: (titleize(payload.action) as 'Publish' | 'Unpublish') || 'None',
    Collection: payload.collection,
    Website: payload.website,
    Products: payload.products,
    'Previous Publications': payload.previous,
    'New Publications': payload.new,
  })

/**
 * Logs the `sync-products-quantity` action to the Google Sheet.
 */
export const logProducts = async (payload: syncProductsPayload) =>
  appendActionLog<syncProductsLog>(SYNC_PRODUCTS_QUANTITY_SHEET, payload, {
    Product: payload.product,
    Variant: payload.variant,
    Website: payload.website,
    'Previous Quantity': payload.previous,
    'New Quantity': payload.new,
    Delta: payload.delta,
  })
