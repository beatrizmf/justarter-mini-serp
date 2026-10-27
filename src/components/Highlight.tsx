import { highlight } from '@/search/highlight'

interface HighlightProps {
  text: string
  query: string
}

/** Highlights the search terms in the text with <mark>. */
export function Highlight({ text, query }: HighlightProps) {
  return (
    <>
      {highlight(text, query).map((segment, index) =>
        segment.match ? <mark key={index}>{segment.text}</mark> : <span key={index}>{segment.text}</span>,
      )}
    </>
  )
}
