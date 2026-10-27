import type { ParsedUrlQuery } from 'node:querystring'
import type { DocumentKind } from '@/types/document'
import type { SearchParams, SortOrder } from './engine'

/**
 * The URL is the source of truth for the search, with short names:
 *   /jurisprudencia/busca?q=dano+moral&p=2&o=data
 *   q = search term, p = page, o = order
 */

export const MAX_PAGE = 50

/** In Next's `context.query`, every value is `string | string[] | undefined`. */
export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function parsePage(value: string | undefined): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

/** The URL says `o=data`; inside the code it is `'date'`. */
function parseSort(value: string | undefined): SortOrder {
  return value === 'data' ? 'date' : 'relevance'
}

/** Turns the query string into typed parameters. The SERP kind comes from the route, not from the URL. */
export function parseSearchParams(query: ParsedUrlQuery, kind: DocumentKind | null): SearchParams {
  return {
    query: (first(query.q) ?? '').trim(),
    kind,
    page: parsePage(first(query.p)),
    sort: parseSort(first(query.o)),
  }
}

/** The way back: builds the query string from the parameters (for links and router.push). */
export function toQueryString(params: Pick<SearchParams, 'query'> & Partial<SearchParams>): string {
  const search = new URLSearchParams({ q: params.query })
  if (params.page && params.page > 1) search.set('p', String(params.page))
  if (params.sort === 'date') search.set('o', 'data')
  return search.toString()
}
