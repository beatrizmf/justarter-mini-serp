import { buildJurisprudence, buildLegislation, buildNews } from '@/test/factories'
import { normalize, search, tokenize, type SearchParams } from './engine'

/**
 * Unit tests: pure functions, no React, no network, no Next.
 * A value goes in, a value comes out. They are the fastest and cheapest tests.
 */

const params = (overrides: Partial<SearchParams> = {}): SearchParams => ({
  query: 'dano moral',
  kind: null,
  page: 1,
  sort: 'relevance',
  ...overrides,
})

describe('normalize', () => {
  it('removes accents and lowercases', () => {
    expect(normalize('Acórdão')).toBe('acordao')
    expect(normalize('PENSÃO ALIMENTÍCIA')).toBe('pensao alimenticia')
  })
})

describe('tokenize', () => {
  it('splits into terms and drops stopwords', () => {
    expect(tokenize('Plano de Saúde')).toEqual(['plano', 'saude'])
  })

  it('returns an empty list when only stopwords are left', () => {
    expect(tokenize('de da do')).toEqual([])
  })
})

describe('search', () => {
  it('finds the document even without accents in the query', () => {
    const document = buildJurisprudence({ title: 'Usucapião extraordinária' })

    const result = search([document], params({ query: 'usucapiao' }))

    expect(result.items).toEqual([document])
  })

  it('requires every term of the query', () => {
    const both = buildJurisprudence({ title: 'Dano moral', snippet: 'qualquer coisa' })
    const onlyOne = buildJurisprudence({ title: 'Dano material', snippet: 'qualquer coisa' })

    const result = search([both, onlyOne], params({ query: 'dano moral' }))

    expect(result.items).toEqual([both])
  })

  it('counts results per kind before applying the kind filter', () => {
    const documents = [buildJurisprudence(), buildJurisprudence(), buildNews({ title: 'Dano moral em voo' })]

    const result = search(documents, params({ kind: 'news' }))

    expect(result.items).toHaveLength(1)
    expect(result.facets).toEqual({ jurisprudence: 2, news: 1 })
  })

  it('with sort=date, orders from newest to oldest', () => {
    const old = buildLegislation({ title: 'Lei de dano moral antiga', publishedAt: '1990-01-01' })
    const recent = buildLegislation({ title: 'Lei de dano moral nova', publishedAt: '2020-01-01' })

    const result = search([old, recent], params({ sort: 'date' }))

    expect(result.items.map((document) => document.publishedAt)).toEqual(['2020-01-01', '1990-01-01'])
  })
})
