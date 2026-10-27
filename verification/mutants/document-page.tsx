// MUTANT: an unknown id redirects to the home page instead of a 404.
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ResultCard } from '@/components/ResultCard'
import { getDocument, listDocumentIds } from '@/search/database'
import type { SearchDocument } from '@/types/document'

/**
 * /documento/[id]: a dynamic route. The part in brackets becomes `params.id`.
 *
 * A document does not change on every request, so this page is SSG: Next
 * generates one HTML file per document at build time (getStaticPaths says which
 * ones exist, getStaticProps fetches each one's data) and serves the ready file.
 */

interface DocumentPageProps {
  document: SearchDocument
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: listDocumentIds().map((id) => ({ params: { id } })),
  // An id outside the list: 404, without trying to generate it on demand.
  fallback: false,
})

export const getStaticProps: GetStaticProps<DocumentPageProps, { id: string }> = async ({ params }) => {
  const document = params ? getDocument(params.id) : undefined
  if (!document) return { redirect: { destination: '/', permanent: false } }
  return { props: { document } }
}

export default function DocumentPage({ document }: DocumentPageProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{`${document.title} - mini-SERP`}</title>
      </Head>
      <main className="document-page">
        <button type="button" className="back" onClick={() => router.back()}>
          ← Voltar aos resultados
        </button>

        <ResultCard document={document} query="" />

        <section className="document-page__body">
          <h2>Inteiro teor</h2>
          <p>
            Este documento é fictício: foi gerado para o projeto didático do Justarter e não tem inteiro teor.
            O resumo acima é tudo o que ele tem.
          </p>
        </section>
      </main>
    </>
  )
}
