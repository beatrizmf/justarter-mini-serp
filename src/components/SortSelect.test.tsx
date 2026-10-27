import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, type NextRouter } from 'next/router'
import { SortSelect } from '@/components/SortSelect'

/**
 * Exercise 2, step 3 (mock).
 *
 * SortSelect calls Next's useRouter(), which does not exist outside a real Next
 * page. jest.mock swaps the whole module for one of ours, and the test checks
 * that the component asked for the right navigation. The mock is ready.
 */
jest.mock('next/router', () => ({ useRouter: jest.fn() }))

/** Sets up the fake router with the current query and returns the `push` spy. */
function mockRouter(query: Record<string, string>) {
  const push = jest.fn()
  jest.mocked(useRouter).mockReturnValue({ pathname: '/jurisprudencia/busca', query, push } as unknown as NextRouter)
  return push
}

describe('SortSelect', () => {
  // Tips:
  // - const push = mockRouter({ q: 'dano moral', p: '3' })
  // - const user = userEvent.setup()
  // - render(<SortSelect value="relevance" />)
  // - await user.selectOptions(screen.getByRole('combobox', { name: 'Ordenar por' }), 'Mais recentes')
  // - expect(push).toHaveBeenCalledWith({ pathname: '...', query: { ... } })
  //   What should happen to p=3 when the order changes? Why?
  it.todo('choosing "Mais recentes" navigates with o=data and back to page 1')
  it.todo('going back to "Relevância" removes the o parameter from the URL')
})
