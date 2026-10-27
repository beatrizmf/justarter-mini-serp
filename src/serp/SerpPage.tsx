import Head from 'next/head'
import { KindFilter } from '@/components/KindFilter'
import { Pagination } from '@/components/Pagination'
import { ResultList } from '@/components/ResultList'
import { SortSelect } from '@/components/SortSelect'
import { plural } from '@/lib/format'
import type { SearchResponse, SortOrder } from '@/search/engine'
import { KIND_LABEL, type DocumentKind } from '@/types/document'

export interface SerpPageProps {
  response: SearchResponse
  kind: DocumentKind | null
  sort: SortOrder
}

/** The results page. It is the same for every route; only `kind` changes. */
export function SerpPage({ response, kind, sort }: SerpPageProps) {
  const section = kind ? KIND_LABEL[kind] : 'Tudo'
  const title = `${response.query} - ${section} - mini-SERP`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content={response.total === 0 ? 'noindex' : 'index,follow'} />
      </Head>

      <div className="serp">
        <aside className="serp__filters">
          <KindFilter query={response.query} current={kind} facets={response.facets} />
        </aside>

        <main className="serp__results">
          <div className="serp__header">
            <p className="serp__count">
              {plural(response.total, 'resultado', 'resultados')} para <strong>{response.query}</strong> em {section}
            </p>
            <SortSelect value={sort} />
          </div>

          {response.total === 0 ? (
            <p className="serp__empty">Nenhum resultado. Tente outras palavras ou remova o filtro.</p>
          ) : (
            <>
              <ResultList items={response.items} query={response.query} />
              <Pagination query={response.query} sort={sort} page={response.page} totalPages={response.totalPages} />
            </>
          )}
        </main>
      </div>
    </>
  )
}
