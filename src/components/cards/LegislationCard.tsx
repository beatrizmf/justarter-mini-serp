import type { Legislation } from '@/types/document'
import { CardShell } from './CardShell'

interface LegislationCardProps {
  document: Legislation
  query: string
}

export function LegislationCard({ document, query }: LegislationCardProps) {
  return (
    <CardShell
      document={document}
      query={query}
      meta={
        <>
          <span className="tag">{document.lawNumber}</span>
          <span>Esfera {document.sphere}</span>
          <span className={document.status === 'revogada' ? 'status status--revoked' : 'status'}>{document.status}</span>
        </>
      }
    />
  )
}
