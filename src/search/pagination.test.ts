import { PAGE_SIZE, pageItems, totalPages } from '@/search/pagination'

/**
 * Exercise 2, step 1 (unit).
 *
 * The bug report: "I searched for 'recurso': there are 23 results, but the
 * pagination stops at page 2. The last 3 decisions are gone."
 *
 * The code in src/search/pagination.ts is right today. Write the tests that
 * would catch this bug if it came back. To watch them fail, swap `Math.ceil`
 * for `Math.floor` in src/search/pagination.ts, run the tests, and undo it.
 */

const items = Array.from({ length: 23 }, (_, index) => `result ${index + 1}`)

describe('pagination', () => {
  // Replace each it.todo('...') with it('...', () => { ... }). Example:
  //   expect(totalPages(23)).toBe(...)
  //   expect(pageItems(items, 3)).toEqual([...])
  it.todo('23 results with 10 per page make 3 pages')
  it.todo('the last page has what is left')
  it.todo('a total that is a multiple of 10 does not create an empty page')
  it.todo('with no results there is still 1 page')
})
