import { parseSearchParams } from './params'

/** `it.each`: the same test over a table of inputs. Great for parsers. */
describe('parseSearchParams', () => {
  it.each([
    { p: undefined, expected: 1 },
    { p: '3', expected: 3 },
    { p: '0', expected: 1 },
    { p: '-2', expected: 1 },
    { p: 'abc', expected: 1 },
    { p: '2.5', expected: 1 },
  ])('p=$p becomes page $expected', ({ p, expected }) => {
    expect(parseSearchParams({ q: 'x', p }, null).page).toBe(expected)
  })

  it('uses the first value when the parameter is repeated (?q=a&q=b)', () => {
    expect(parseSearchParams({ q: ['a', 'b'] }, null).query).toBe('a')
  })

  it('only accepts o=data; anything else is relevance', () => {
    expect(parseSearchParams({ q: 'x', o: 'data' }, null).sort).toBe('date')
    expect(parseSearchParams({ q: 'x', o: 'other' }, null).sort).toBe('relevance')
  })

  it('the kind comes from the route, not from the URL', () => {
    expect(parseSearchParams({ q: 'x', kind: 'news' }, 'legislation').kind).toBe('legislation')
  })
})
