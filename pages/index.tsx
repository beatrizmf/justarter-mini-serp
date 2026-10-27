import Head from 'next/head'
import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'

/**
 * The home page has neither getServerSideProps nor getStaticProps: Next generates
 * the HTML once, at build time (a static page), and serves the same file to everyone.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>mini-SERP</title>
      </Head>
      <main className="home">
        <h1 className="logo logo--big">
          mini<span>SERP</span>
        </h1>
        <p className="home__tagline">Uma mini cópia de uma página de busca, para praticar TypeScript, React e Next.</p>
        <SearchBar autoFocus />
        <p className="home__hints">
          Experimente: <Link href="/busca?q=dano+moral">dano moral</Link> ·{' '}
          <Link href="/jurisprudencia/busca?q=horas+extras">horas extras</Link> · <Link href="/busca?q=usucapiao">usucapião</Link> ·{' '}
          <Link href="/csr/busca?q=plano+de+saude">plano de saúde (CSR)</Link>
        </p>
      </main>
    </>
  )
}
