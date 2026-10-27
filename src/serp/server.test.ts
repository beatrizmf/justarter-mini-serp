/**
 * @jest-environment node
 */
import type { GetServerSidePropsContext } from 'next'
import { runSearch } from '@/search/database'
import type { SearchResponse } from '@/search/engine'
import { buildJurisprudence } from '@/test/factories'
import { createSerpServerSideProps } from './server'

/**
 * getServerSideProps is an async function: the test calls it directly, with no
 * server. The database is replaced by a mock (jest.mock), so the test controls
 * what the "search" returns and checks how the page reacts.
 */
jest.mock('@/search/database', () => ({ runSearch: jest.fn() }))
const runSearchMock = jest.mocked(runSearch)

function buildContext(query: Record<string, string>): GetServerSidePropsContext {
  return {
    query,
    resolvedUrl: `/jurisprudencia/busca?${new URLSearchParams(query)}`,
    res: { statusCode: 200 },
  } as unknown as GetServerSidePropsContext
}

function buildResponse(overrides: Partial<SearchResponse> = {}): SearchResponse {
  return { query: 'dano', items: [], total: 0, page: 1, totalPages: 1, facets: {}, ...overrides }
}

const getServerSideProps = createSerpServerSideProps('jurisprudence')

describe('SERP getServerSideProps', () => {
  beforeEach(() => {
    runSearchMock.mockReset()
  })

  it('an empty search redirects to the home page without querying the database', async () => {
    const result = await getServerSideProps(buildContext({ q: '   ' }))

    expect(result).toEqual({ redirect: { destination: '/', permanent: false } })
    expect(runSearchMock).not.toHaveBeenCalled()
  })

  it('queries the database with the URL parameters and the route kind', async () => {
    runSearchMock.mockResolvedValue(buildResponse({ total: 1, items: [buildJurisprudence()] }))

    await getServerSideProps(buildContext({ q: 'dano moral', p: '2', o: 'data' }))

    expect(runSearchMock).toHaveBeenCalledWith({ query: 'dano moral', kind: 'jurisprudence', page: 2, sort: 'date' })
  })

  it('with no results, renders the page with status 404', async () => {
    runSearchMock.mockResolvedValue(buildResponse({ total: 0 }))
    const context = buildContext({ q: 'xyz' })

    const result = await getServerSideProps(context)

    expect(context.res.statusCode).toBe(404)
    expect(result).toHaveProperty('props')
  })

  it('a page above 50 redirects to page 50, keeping the search', async () => {
    const result = await getServerSideProps(buildContext({ q: 'dano', p: '51', o: 'data' }))

    expect(result).toEqual({
      redirect: { destination: '/jurisprudencia/busca?q=dano&p=50&o=data', permanent: true },
    })
    expect(runSearchMock).not.toHaveBeenCalled()
  })
})
