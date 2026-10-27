// MUTANT: the page links drop the order (o=data).
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { SortOrder } from '@/search/engine'
import { toQueryString } from '@/search/params'

interface PaginationProps {
  query: string
  sort: SortOrder
  page: number
  totalPages: number
}

/** Pagination with real links (<a href>): Google's crawler can follow them. */
export function Pagination({ query, sort, page, totalPages }: PaginationProps) {
  const { pathname } = useRouter()
  if (totalPages <= 1) return null

  const hrefFor = (target: number) => `${pathname}?${toQueryString({ query, page: target })}`
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Paginação">
      {page > 1 && <Link href={hrefFor(page - 1)}>Anterior</Link>}
      {pages.map((target) => (
        <Link key={target} href={hrefFor(target)} aria-current={target === page ? 'page' : undefined}>
          {target}
        </Link>
      ))}
      {page < totalPages && <Link href={hrefFor(page + 1)}>Próxima</Link>}
    </nav>
  )
}
