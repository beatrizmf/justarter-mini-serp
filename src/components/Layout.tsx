import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { SearchBar } from './SearchBar'

/** Top bar with the logo and the search field, on every page except the home. */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome && (
        <header className="topbar">
          <Link href="/" className="logo">
            mini<span>SERP</span>
          </Link>
          <SearchBar action={pathname.startsWith('/csr') ? '/csr/busca' : '/busca'} />
        </header>
      )}
      {children}
      <footer className="footer">Projeto didático do Justarter 2026. Todos os documentos são fictícios.</footer>
    </>
  )
}
