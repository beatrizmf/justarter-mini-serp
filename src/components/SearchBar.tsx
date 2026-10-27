import { useRouter } from 'next/router'
import { useState, type FormEvent } from 'react'
import { first, toQueryString } from '@/search/params'

interface SearchBarProps {
  /** Where the search goes. Default: the general SERP. */
  action?: string
  autoFocus?: boolean
}

/** Controlled search field: the input value lives in React state. */
export function SearchBar({ action = '/busca', autoFocus = false }: SearchBarProps) {
  const router = useRouter()
  const urlQuery = first(router.query.q) ?? ''
  const [value, setValue] = useState(urlQuery)

  // When the URL changes (browser back, a filter click), the field follows.
  // No useEffect: the React docs recommend adjusting state while rendering.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [previousUrlQuery, setPreviousUrlQuery] = useState(urlQuery)
  if (urlQuery !== previousUrlQuery) {
    setPreviousUrlQuery(urlQuery)
    setValue(urlQuery)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = value.trim()
    if (!query) return
    void router.push(`${action}?${toQueryString({ query })}`)
  }

  return (
    <form role="search" className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        name="q"
        aria-label="Buscar"
        placeholder="Busque por jurisprudência, leis, notícias..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
      />
      <button type="submit">Buscar</button>
    </form>
  )
}
