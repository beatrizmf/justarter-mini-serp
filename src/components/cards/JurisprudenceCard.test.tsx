import { render, screen } from '@testing-library/react'
import { buildJurisprudence } from '@/test/factories'
import { JurisprudenceCard } from './JurisprudenceCard'

/**
 * Component test: renders into a fake DOM (jsdom) and looks for things the way
 * a person would: by role and by text.
 */
describe('JurisprudenceCard', () => {
  it('shows the title as a link to the document', () => {
    const document = buildJurisprudence({ title: 'TJSP - Apelação 123', url: '/documento/jurisprudence-123' })

    render(<JurisprudenceCard document={document} query="apelação" />)

    expect(screen.getByRole('link', { name: 'TJSP - Apelação 123' })).toHaveAttribute('href', '/documento/jurisprudence-123')
  })

  it('shows the court, decision type, rapporteur and date', () => {
    const document = buildJurisprudence({
      court: 'STJ',
      decisionType: 'Decisão monocrática',
      rapporteur: 'Min. Helena Prado',
      publishedAt: '2024-05-17',
    })

    render(<JurisprudenceCard document={document} query="x" />)

    expect(screen.getByText('STJ')).toBeInTheDocument()
    expect(screen.getByText('Decisão monocrática')).toBeInTheDocument()
    expect(screen.getByText('Relator(a): Min. Helena Prado')).toBeInTheDocument()
    expect(screen.getByText('17/05/2024')).toBeInTheDocument()
  })

  it('highlights the search terms, even with different accents', () => {
    const document = buildJurisprudence({ snippet: 'Pedido de usucapião julgado procedente.' })

    render(<JurisprudenceCard document={document} query="usucapiao" />)

    // The text we look for is the original, accented one; `selector` limits the search to <mark>.
    expect(screen.getByText('usucapião', { selector: 'mark' })).toBeInTheDocument()
  })
})
