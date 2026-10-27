import type { DocumentKind, SearchDocument } from '@/types/document'
import { pageItems, totalPages } from './pagination'

/**
 * An in-memory "search engine": a pure function over a list of documents, so
 * the project runs without depending on any other service.
 */

/** No `o` in the URL sorts by relevance; `o=data` sorts by most recent. */
export type SortOrder = 'relevance' | 'date'

export interface SearchParams {
  query: string
  /** `null` = every kind (the general SERP, /busca). */
  kind: DocumentKind | null
  page: number
  sort: SortOrder
}

export interface SearchResponse {
  query: string
  items: SearchDocument[]
  total: number
  page: number
  totalPages: number
  /** How many results each kind has for this search, for the filters. */
  facets: Partial<Record<DocumentKind, number>>
}

const STOPWORDS = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'por', 'para', 'com'])

/** "Acórdão" -> "acordao": lowercase, no accents. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Splits the query into terms, without accents and without stopwords. */
export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1 && !STOPWORDS.has(term))
}

/** Scores a document: a term in the title is worth 3, in the snippet 1. Missing any term, 0. */
function score(document: SearchDocument, terms: string[]): number {
  const title = normalize(document.title)
  const snippet = normalize(document.snippet)
  let total = 0
  for (const term of terms) {
    const inTitle = title.includes(term)
    const inSnippet = snippet.includes(term)
    if (!inTitle && !inSnippet) return 0
    total += (inTitle ? 3 : 0) + (inSnippet ? 1 : 0)
  }
  return total
}

export function search(documents: SearchDocument[], params: SearchParams): SearchResponse {
  const terms = tokenize(params.query)

  const matches = documents
    .map((document) => ({ document, score: score(document, terms) }))
    .filter((match) => match.score > 0)

  const facets: Partial<Record<DocumentKind, number>> = {}
  for (const { document } of matches) {
    facets[document.kind] = (facets[document.kind] ?? 0) + 1
  }

  const filtered = params.kind ? matches.filter((match) => match.document.kind === params.kind) : matches

  const sorted = [...filtered].sort((a, b) =>
    params.sort === 'date'
      ? b.document.publishedAt.localeCompare(a.document.publishedAt)
      : b.score - a.score || b.document.publishedAt.localeCompare(a.document.publishedAt),
  )

  const total = sorted.length

  return {
    query: params.query,
    items: pageItems(sorted, params.page).map((match) => match.document),
    total,
    page: params.page,
    totalPages: totalPages(total),
    facets,
  }
}
