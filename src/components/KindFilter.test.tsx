import { render, screen } from '@testing-library/react'
import { KindFilter } from '@/components/KindFilter'
import type { DocumentKind } from '@/types/document'

/** Exercise 2, step 2 (component): render it and look for what a person sees. */

describe('KindFilter', () => {
  const facets = { jurisprudence: 4, news: 2 }
  const renderFilter = (current: DocumentKind | null = null) =>
    render(<KindFilter query="usucapião" current={current} facets={facets} />)

  // Tips:
  // - renderFilter() draws the filter; renderFilter('news') draws it with "Notícias" selected
  // - screen.getByRole('link', { name: 'Notícias 2' }): a link's accessible name is its text
  // - expect(link).toHaveAttribute('href', '...') and toHaveAttribute('aria-current', 'page')
  // - Not sure what is on the screen? screen.debug()
  it.todo('shows each kind with its count, and zero for kinds without results')
  it.todo('"Tudo" adds up every kind')
  it.todo('each link goes to the kind route, keeping the search')
  it.todo('marks the current kind with aria-current')
})
