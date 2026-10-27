/** How many results fit on one page of the SERP. */
export const PAGE_SIZE = 10

/** How many pages a search with `total` results has. With no results there is still 1 page. */
export function totalPages(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

/** The items of page `page` (counting from 1). */
export function pageItems<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}
