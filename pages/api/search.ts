import type { NextApiRequest, NextApiResponse } from 'next'
import { runSearch } from '@/search/database'
import type { SearchResponse } from '@/search/engine'
import { parseSearchParams } from '@/search/params'
import { isDocumentKind } from '@/types/document'

type ErrorResponse = { error: string }

/**
 * GET /api/search?q=...&kind=...&p=...&o=...
 * An API route: it returns JSON instead of HTML. The CSR version of the SERP uses it.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchResponse | ErrorResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Use GET' })
  }

  const kind = isDocumentKind(req.query.kind) ? req.query.kind : null
  const params = parseSearchParams(req.query, kind)
  if (!params.query) {
    return res.status(400).json({ error: 'O parâmetro q é obrigatório' })
  }

  return res.status(200).json(await runSearch(params))
}
