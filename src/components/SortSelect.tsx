import { useRouter } from 'next/router'
import type { ChangeEvent } from 'react'
import type { SortOrder } from '@/search/engine'

interface SortSelectProps {
  value: SortOrder
}

/**
 * This component needs the browser: it reacts to `onChange`. The HTML comes
 * ready from the server and React attaches the event later (hydration).
 */
export function SortSelect({ value }: SortSelectProps) {
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { o: _currentSort, p: _currentPage, ...rest } = router.query
    const query = event.target.value === 'date' ? { ...rest, o: 'data' } : rest
    // Changing the URL makes Next call getServerSideProps again and swap the page.
    void router.push({ pathname: router.pathname, query })
  }

  return (
    <label className="sort">
      Ordenar por{' '}
      <select value={value} onChange={handleChange}>
        <option value="relevance">Relevância</option>
        <option value="date">Mais recentes</option>
      </select>
    </label>
  )
}
