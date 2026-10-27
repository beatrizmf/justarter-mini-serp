import { assertNever } from '@/lib/assert-never'
import type { SearchDocument } from '@/types/document'
import { JurisprudenceCard } from './cards/JurisprudenceCard'
import { LegislationCard } from './cards/LegislationCard'
import { NewsCard } from './cards/NewsCard'
import { TemplateCard } from './cards/TemplateCard'

interface ResultCardProps {
  document: SearchDocument
  query: string
}

/**
 * Picks the card by `kind`. Inside each `case`, TypeScript narrows the type:
 * in `case 'jurisprudence'`, `document` is a `Jurisprudence`.
 */
export function ResultCard({ document, query }: ResultCardProps) {
  switch (document.kind) {
    case 'jurisprudence':
      return <JurisprudenceCard document={document} query={query} />
    case 'legislation':
      return <LegislationCard document={document} query={query} />
    case 'news':
      return <NewsCard document={document} query={query} />
    case 'template':
      return <TemplateCard document={document} query={query} />
    default:
      return assertNever(document)
  }
}
