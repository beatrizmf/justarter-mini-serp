import { formatNumber } from '@/lib/format'
import type { DocumentTemplate } from '@/types/document'
import { CardShell } from './CardShell'

interface TemplateCardProps {
  document: DocumentTemplate
  query: string
}

export function TemplateCard({ document, query }: TemplateCardProps) {
  return (
    <CardShell
      document={document}
      query={query}
      meta={
        <>
          <span className="tag">{document.area}</span>
          <span>{formatNumber(document.downloads)} downloads</span>
        </>
      }
    />
  )
}
