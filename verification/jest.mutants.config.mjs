import baseConfig from '../jest.config.mjs'

// Only for `npm run verify:class-2`: swaps one module for a mutant (a copy with
// a bug) and runs the matching test. If the tests are good, they fail.
// next/jest's SWC rewrites `@/...` imports to relative paths before Jest
// resolves them, so the patterns match the end of the path.
const MUTANTS = {
  pagination: ['(^|/)pagination$', '<rootDir>/verification/mutants/pagination.ts'],
  filter: ['(^|/)KindFilter$', '<rootDir>/verification/mutants/KindFilter.tsx'],
  sort: ['(^|/)SortSelect$', '<rootDir>/verification/mutants/SortSelect.tsx'],
}

const mutant = MUTANTS[process.env.MUTANT ?? '']
if (!mutant) throw new Error(`Invalid MUTANT: ${process.env.MUTANT}`)

export default async function config() {
  const base = await baseConfig()
  const [pattern, file] = mutant
  return { ...base, rootDir: '..', moduleNameMapper: { [pattern]: file, ...base.moduleNameMapper } }
}
