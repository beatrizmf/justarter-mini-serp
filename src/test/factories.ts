import type { DocumentTemplate, Jurisprudence, Legislation, News } from '@/types/document'

/**
 * Document factories for tests: each one returns a valid document, and the test
 * changes only what matters to it (`overrides`). Tests stay short and do not
 * break when a new field shows up.
 */

let sequence = 0
const nextId = (prefix: string) => `${prefix}-${++sequence}`

export function buildJurisprudence(overrides: Partial<Jurisprudence> = {}): Jurisprudence {
  return {
    id: nextId('jurisprudence'),
    kind: 'jurisprudence',
    title: 'TJSP - Apelação Cível 0000001-00.2024.8.26.0001',
    snippet: 'DANO MORAL. Negativação indevida. Recurso provido.',
    url: '/documento/exemplo',
    publishedAt: '2024-05-17',
    court: 'TJSP',
    rapporteur: 'Des. Fulana de Tal',
    decisionType: 'Acórdão',
    ...overrides,
  }
}

export function buildLegislation(overrides: Partial<Legislation> = {}): Legislation {
  return {
    id: nextId('legislation'),
    kind: 'legislation',
    title: 'Código de Defesa do Consumidor - Lei nº 8.078/1990',
    snippet: 'Dispõe sobre a proteção do consumidor.',
    url: '/documento/exemplo',
    publishedAt: '1990-09-11',
    lawNumber: 'Lei nº 8.078/1990',
    sphere: 'federal',
    status: 'vigente',
    ...overrides,
  }
}

export function buildNews(overrides: Partial<News> = {}): News {
  return {
    id: nextId('news'),
    kind: 'news',
    title: 'Tribunal decide sobre dano moral',
    snippet: 'Especialistas comentam a decisão.',
    url: '/documento/exemplo',
    publishedAt: '2026-01-10',
    source: 'Gazeta do Direito',
    author: 'Ana Ribeiro',
    ...overrides,
  }
}

export function buildTemplate(overrides: Partial<DocumentTemplate> = {}): DocumentTemplate {
  return {
    id: nextId('template'),
    kind: 'template',
    title: 'Petição inicial - dano moral',
    snippet: 'Modelo de petição inicial.',
    url: '/documento/exemplo',
    publishedAt: '2025-03-01',
    area: 'Consumidor',
    downloads: 1234,
    ...overrides,
  }
}
