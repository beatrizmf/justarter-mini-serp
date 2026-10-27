import { assertNever } from '@/lib/assert-never'
import { isDocumentKind, type SearchDocument } from '@/types/document'

/**
 * Data from outside (database, API, JSON) comes in as `unknown`: TypeScript
 * does not trust it until someone checks it. These functions check it.
 */

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasStrings(record: UnknownRecord, keys: string[]): boolean {
  return keys.every((key) => typeof record[key] === 'string')
}

const BASE_FIELDS = ['id', 'title', 'snippet', 'url', 'publishedAt']

export function isSearchDocument(value: unknown): value is SearchDocument {
  if (!isRecord(value) || !hasStrings(value, BASE_FIELDS)) return false
  const kind = value.kind
  if (!isDocumentKind(kind)) return false

  switch (kind) {
    case 'jurisprudence':
      return hasStrings(value, ['court', 'rapporteur', 'decisionType'])
    case 'legislation':
      return hasStrings(value, ['lawNumber', 'sphere', 'status'])
    case 'news':
      return hasStrings(value, ['source', 'author'])
    case 'template':
      return hasStrings(value, ['area']) && typeof value.downloads === 'number'
    default:
      return assertNever(kind)
  }
}

/** Keeps only valid documents; everything else is dropped. */
export function parseDocuments(raw: unknown): SearchDocument[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(isSearchDocument)
}
