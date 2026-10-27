import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ResultList } from '@/components/ResultList'
import { plural } from '@/lib/format'
import type { SearchResponse } from '@/search/engine'
import { first, toQueryString } from '@/search/params'

/**
 * The SAME search, rendered in the browser (CSR), to compare with /busca.
 *
 * There is no getServerSideProps: the server sends an almost empty HTML, the
 * JavaScript loads, and only then the component asks /api/search for the data.
 * Open "View page source" for this page and for /busca and compare.
 *
 * In a real project, the Next docs recommend a data-fetching library (SWR,
 * TanStack Query) for client-side fetching. Here the fetch is hand-written so
 * every piece is visible.
 */

/** How the request ended: a discriminated union, `data` and `message` can never coexist. */
type Outcome = { status: 'error'; message: string } | { status: 'success'; data: SearchResponse }

type RequestState = { status: 'loading' } | Outcome

export default function CsrSearchPage() {
  const router = useRouter()
  const query = first(router.query.q) ?? ''
  const [result, setResult] = useState<{ query: string; outcome: Outcome } | null>(null)

  useEffect(() => {
    // On the first render of a page without SSR, router.query is still empty.
    if (!router.isReady || !query) return

    // `ignore` drops the response of an old search that arrives after the new one.
    // https://react.dev/learn/you-might-not-need-an-effect#fetching-data
    let ignore = false
    const controller = new AbortController()

    fetch(`/api/search?${toQueryString({ query })}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<SearchResponse>
      })
      .then((data) => {
        if (!ignore) setResult({ query, outcome: { status: 'success', data } })
      })
      .catch((error: unknown) => {
        if (ignore) return
        setResult({ query, outcome: { status: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' } })
      })

    // Cleanup: if the search changes before the response arrives, ignore it and abort the old request.
    return () => {
      ignore = true
      controller.abort()
    }
  }, [router.isReady, query])

  // Derived while rendering: until the response for THIS search arrives, it is loading.
  const state: RequestState = result?.query === query ? result.outcome : { status: 'loading' }

  return (
    <>
      <Head>
        <title>{`${query} - CSR - mini-SERP`}</title>
      </Head>
      <main className="serp serp--single">
        <div className="serp__results">
          <p className="banner">Versão CSR: os resultados são buscados no navegador, depois que a página carrega.</p>
          {state.status === 'loading' && <p className="serp__loading">Carregando resultados...</p>}
          {state.status === 'error' && <p className="serp__empty">Não deu para buscar agora ({state.message}).</p>}
          {state.status === 'success' && (
            <>
              <p className="serp__count">
                {plural(state.data.total, 'resultado', 'resultados')} para <strong>{state.data.query}</strong>
              </p>
              <ResultList items={state.data.items} query={state.data.query} />
            </>
          )}
        </div>
      </main>
    </>
  )
}
