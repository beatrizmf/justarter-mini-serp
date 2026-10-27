import type { SearchDocument } from '@/types/document'
import { ResultCard } from './ResultCard'

interface ResultListProps {
  items: SearchDocument[]
  query: string
}

export function ResultList({ items, query }: ResultListProps) {
  return (
    <ol className="result-list">
      {items.map((document) => (
        // A stable `key` (the id), never the index: React uses the key to tell items apart.
        <li key={document.id}>
          <ResultCard document={document} query={query} />
        </li>
      ))}
    </ol>
  )
}
