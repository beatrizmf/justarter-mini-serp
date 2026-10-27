import Link from 'next/link'
import type { ReactNode } from 'react'
import { Highlight } from '@/components/Highlight'
import { formatDate } from '@/lib/format'
import { KIND_LABEL, type SearchDocument } from '@/types/document'

interface CardShellProps {
  document: SearchDocument
  query: string
  /** What is specific to each kind (court, author, status...). */
  meta: ReactNode
}

/** The shell every card shares: kind, linked title, snippet and date. */
export function CardShell({ document, query, meta }: CardShellProps) {
  return (
    <article className="card" data-kind={document.kind}>
      <span className="card__kind">{KIND_LABEL[document.kind]}</span>
      <h2 className="card__title">
        <Link href={document.url}>
          <Highlight text={document.title} query={query} />
        </Link>
      </h2>
      <div className="card__meta">
        {meta}
        <span>{formatDate(document.publishedAt)}</span>
      </div>
      <p className="card__snippet">
        <Highlight text={document.snippet} query={query} />
      </p>
    </article>
  )
}
