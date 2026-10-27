// MUTANT: returns the text without accents instead of the original.
import { normalize, tokenize } from '@/search/engine'

export interface Segment {
  text: string
  match: boolean
}

/**
 * Splits the text into pieces, flagging the ones that match a search term.
 * Matching ignores accents and case, but the returned text is the original.
 */
export function highlight(text: string, query: string): Segment[] {
  const terms = tokenize(query)
  if (terms.length === 0) return [{ text, match: false }]

  // normalize() keeps the text length for Portuguese accents (NFD + removal),
  // so a position in the normalized text is also a position in the original.
  const normalized = normalize(text)
  const marks = new Array<boolean>(text.length).fill(false)
  for (const term of terms) {
    let index = normalized.indexOf(term)
    while (index !== -1) {
      marks.fill(true, index, index + term.length)
      index = normalized.indexOf(term, index + term.length)
    }
  }

  const segments: Segment[] = []
  for (let i = 0; i < text.length; i++) {
    const match = marks[i] ?? false
    const last = segments.at(-1)
    if (last && last.match === match) last.text += normalized[i]
    else segments.push({ text: normalized[i] ?? '', match })
  }
  return segments
}
