import type { SearchDocument } from '@/types/document'
import rawDocuments from '../../data/documents.json'
import { search, type SearchParams, type SearchResponse } from './engine'
import { parseDocuments } from './validate'

/**
 * The project's "database": a JSON file with fictitious documents.
 *
 * This module only runs on the server (getServerSideProps, getStaticProps and
 * API routes). No component imports it, so the JSON never reaches the browser.
 */

const documents = parseDocuments(rawDocuments as unknown)

/** Artificial latency, so the difference between SSR and CSR is visible. */
const LATENCY_MS = Number(process.env.SEARCH_LATENCY_MS ?? 400)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** The "database query": async, like a real network call would be. */
export async function runSearch(params: SearchParams): Promise<SearchResponse> {
  await sleep(LATENCY_MS)
  return search(documents, params)
}

/** Suggestions for the autocomplete: distinct titles that match what was typed. */
export async function suggest(prefix: string, limit = 5): Promise<string[]> {
  await sleep(LATENCY_MS / 2)
  const { items } = search(documents, { query: prefix, kind: null, page: 1, sort: 'relevance' })
  const titles = new Set(items.map((document) => document.title))
  return [...titles].slice(0, limit)
}

/** Every id, so Next generates one static page per document at build time. */
export function listDocumentIds(): string[] {
  return documents.map((document) => document.id)
}

export function getDocument(id: string): SearchDocument | undefined {
  return documents.find((document) => document.id === id)
}
