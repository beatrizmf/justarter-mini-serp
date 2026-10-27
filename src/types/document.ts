/**
 * The search data model.
 *
 * Every document kind (jurisprudence, legislation, news...) shares some fields
 * (BaseDocument) and has fields of its own. The `kind` field is the tag that
 * says which one it is: this is a discriminated union.
 */

interface BaseDocument {
  id: string
  title: string
  snippet: string
  url: string
  /** ISO date, e.g. "2024-05-17". */
  publishedAt: string
}

export interface Jurisprudence extends BaseDocument {
  kind: 'jurisprudence'
  court: string
  rapporteur: string
  decisionType: 'Acórdão' | 'Decisão monocrática'
}

export interface Legislation extends BaseDocument {
  kind: 'legislation'
  lawNumber: string
  sphere: 'federal' | 'estadual' | 'municipal'
  status: 'vigente' | 'revogada'
}

export interface News extends BaseDocument {
  kind: 'news'
  source: string
  author: string
}

export interface DocumentTemplate extends BaseDocument {
  kind: 'template'
  area: string
  downloads: number
}

// TODO exercise 1, step 1: data/documents.json already has doctrine documents,
// but the search drops them because this union does not know them. Create the
// `Doctrine` interface (extending BaseDocument, like the others) and add it to
// the union. Its own fields: kind 'doctrine', author, work and publisher
// (strings) and edition (a number). Then run `npm run typecheck`.
export type SearchDocument = Jurisprudence | Legislation | News | DocumentTemplate

/** The union of every `kind` value, derived from the type above: no repeated list. */
export type DocumentKind = SearchDocument['kind']

/**
 * `Record<DocumentKind, string>` requires an entry for every kind. When a new
 * kind joins the union, the compiler points out that it is missing here.
 */
export const KIND_LABEL: Record<DocumentKind, string> = {
  jurisprudence: 'Jurisprudência',
  legislation: 'Legislação',
  news: 'Notícias',
  template: 'Modelos de peças',
}

/** The SERP route of each kind: /<kind>/busca. */
export const KIND_PATH: Record<DocumentKind, string> = {
  jurisprudence: '/jurisprudencia/busca',
  legislation: '/legislacao/busca',
  news: '/noticias/busca',
  template: '/modelos-pecas/busca',
}

export const DOCUMENT_KINDS = Object.keys(KIND_LABEL) as DocumentKind[]

/** Type guard: after `if (isDocumentKind(x))`, TypeScript knows that `x` is a DocumentKind. */
export function isDocumentKind(value: unknown): value is DocumentKind {
  return typeof value === 'string' && (DOCUMENT_KINDS as string[]).includes(value)
}
