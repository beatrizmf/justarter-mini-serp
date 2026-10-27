const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })
const numberFormatter = new Intl.NumberFormat('pt-BR')

/** "2024-05-17" -> "17/05/2024" */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

/** 12345 -> "12.345" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/** Picks the singular or plural form: plural(1, 'resultado', 'resultados'). */
export function plural(count: number, singular: string, pluralForm: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`
}
