import type { News } from '@/types/document'
import { CardShell } from './CardShell'

interface NewsCardProps {
  document: News
  query: string
}

export function NewsCard({ document, query }: NewsCardProps) {
  return (
    <CardShell
      document={document}
      query={query}
      meta={
        <>
          <span className="tag">{document.source}</span>
          <span>Por {document.author}</span>
        </>
      }
    />
  )
}
