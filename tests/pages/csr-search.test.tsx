import { render, screen } from '@testing-library/react'
import { useRouter, type NextRouter } from 'next/router'
import type { SearchResponse } from '@/search/engine'
import { buildNews } from '@/test/factories'
import CsrSearchPage from '../../pages/csr/busca'

/**
 * The three states of the CSR SERP (loading, success, error), with a fake router
 * and a fake fetch. It lives outside pages/ because in the Pages Router every
 * file inside pages/ becomes a route.
 */
jest.mock('next/router', () => ({ useRouter: jest.fn() }))

const fetchMock = jest.fn()

function mockRouter(query: Record<string, string>, isReady = true) {
  jest.mocked(useRouter).mockReturnValue({ query, isReady } as unknown as NextRouter)
}

function buildResponse(overrides: Partial<SearchResponse> = {}): SearchResponse {
  return { query: 'voo', items: [], total: 0, page: 1, totalPages: 1, facets: {}, ...overrides }
}

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock
})

describe('CSR SERP', () => {
  it('shows "loading" while the response has not arrived', () => {
    mockRouter({ q: 'voo' })
    fetchMock.mockReturnValue(new Promise(() => {}))

    render(<CsrSearchPage />)

    expect(screen.getByText('Carregando resultados...')).toBeInTheDocument()
  })

  it('does not fetch anything while the router is not ready', () => {
    mockRouter({}, false)

    render(<CsrSearchPage />)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows the results when the API responds', async () => {
    mockRouter({ q: 'voo' })
    const document = buildNews({ title: 'Cancelamento de voo' })
    fetchMock.mockResolvedValue({ ok: true, json: async () => buildResponse({ items: [document], total: 1 }) })

    render(<CsrSearchPage />)

    expect(await screen.findByRole('link', { name: 'Cancelamento de voo' })).toBeInTheDocument()
    expect(screen.getByText(/1 resultado/)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/search?q=voo', expect.anything())
  })

  it('shows a message when the API fails', async () => {
    mockRouter({ q: 'voo' })
    fetchMock.mockResolvedValue({ ok: false, status: 500 })

    render(<CsrSearchPage />)

    expect(await screen.findByText('Não deu para buscar agora (HTTP 500).')).toBeInTheDocument()
  })
})
