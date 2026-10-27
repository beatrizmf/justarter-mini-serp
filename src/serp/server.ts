import type { GetServerSideProps } from 'next'
import { runSearch } from '@/search/database'
import { MAX_PAGE, parseSearchParams, toQueryString } from '@/search/params'
import type { DocumentKind } from '@/types/document'
import type { SerpPageProps } from './SerpPage'

/**
 * Factory for a SERP's getServerSideProps. Each route (/busca,
 * /jurisprudencia/busca...) calls it with its own kind.
 *
 * Everything here runs on the server, on every request.
 */
export function createSerpServerSideProps(kind: DocumentKind | null): GetServerSideProps<SerpPageProps> {
  return async (context) => {
    const params = parseSearchParams(context.query, kind)

    // An empty search has no SERP: back to the home page.
    if (!params.query) {
      return { redirect: { destination: '/', permanent: false } }
    }

    // Page out of range: redirect to the last allowed page.
    if (params.page > MAX_PAGE) {
      const destination = `${context.resolvedUrl.split('?')[0]}?${toQueryString({ ...params, page: MAX_PAGE })}`
      return { redirect: { destination, permanent: true } }
    }

    const response = await runSearch(params)

    // No results: the page still renders, but with status 404 (so Google does not index it).
    if (response.total === 0) {
      context.res.statusCode = 404
    }

    return { props: { response, kind, sort: params.sort } }
  }
}
