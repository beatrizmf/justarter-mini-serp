import type { NextApiRequest, NextApiResponse } from 'next'
import { suggest } from '@/search/database'
import { first } from '@/search/params'

export interface SuggestionsResponse {
  suggestions: string[]
}

/**
 * GET /api/suggestions?q=dano
 * Suggestions for the autocomplete (used in the final challenge).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SuggestionsResponse>) {
  const prefix = (first(req.query.q) ?? '').trim()
  if (prefix.length < 2) {
    return res.status(200).json({ suggestions: [] })
  }
  return res.status(200).json({ suggestions: await suggest(prefix) })
}
