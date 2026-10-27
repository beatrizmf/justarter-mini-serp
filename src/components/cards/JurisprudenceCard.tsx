import type { Jurisprudence } from '@/types/document'
import { CardShell } from './CardShell'

interface JurisprudenceCardProps {
  document: Jurisprudence
  query: string
}

export function JurisprudenceCard({ document, query }: JurisprudenceCardProps) {
  return (
    <CardShell
      document={document}
      query={query}
      meta={
        <>
          <span className="tag">{document.court}</span>
          <span>{document.decisionType}</span>
          <span>Relator(a): {document.rapporteur}</span>
        </>
      }
    />
  )
}
