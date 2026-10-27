// MUTANT: every kind links to /busca.
import Link from 'next/link'
import { formatNumber } from '@/lib/format'
import { toQueryString } from '@/search/params'
import { DOCUMENT_KINDS, KIND_LABEL, type DocumentKind } from '@/types/document'

interface KindFilterProps {
  query: string
  current: DocumentKind | null
  facets: Partial<Record<DocumentKind, number>>
}

/**
 * Filter by kind. Each option links to another route (/<kind>/busca):
 * changing the kind is a navigation, and the server renders again.
 */
export function KindFilter({ query, current, facets }: KindFilterProps) {
  const total = Object.values(facets).reduce((sum, count) => sum + count, 0)
  const queryString = toQueryString({ query })

  return (
    <nav aria-label="Filtrar por tipo">
      <h2 className="filters__title">Tipo de documento</h2>
      <ul className="filters__list">
        <li>
          <Link href={`/busca?${queryString}`} aria-current={current === null ? 'page' : undefined}>
            Tudo <span className="filters__count">{formatNumber(total)}</span>
          </Link>
        </li>
        {DOCUMENT_KINDS.map((kind) => (
          <li key={kind}>
            <Link href={`/busca?${queryString}`} aria-current={current === kind ? 'page' : undefined}>
              {KIND_LABEL[kind]} <span className="filters__count">{formatNumber(facets[kind] ?? 0)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
