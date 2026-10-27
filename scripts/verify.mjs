// Checks an exercise or a challenge. Usage:
//   npm run verify:class-1       exercise of class 1: doctrine in the search
//   npm run verify:class-2       exercise of class 2: your tests pass and catch planted bugs
//   npm run verify:challenge-1   challenge 1: the autocomplete
//   npm run verify:challenge-2   challenge 2: your tests for code that had none
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const target = process.argv[2]
const results = []
const record = (name, passed, detail = '') => results.push({ name, passed, detail })

function compiler() {
  console.log('\n▶ Compiler (tsc --noEmit)\n')
  record('Compiler (tsc --noEmit)', spawnSync('npx', ['tsc', '--noEmit'], { stdio: 'inherit' }).status === 0)
}

/** Runs jest and returns its JSON report. */
function jest(args) {
  const output = join(mkdtempSync(join(tmpdir(), 'verify-')), 'jest.json')
  spawnSync('npx', ['jest', '--ci', '--json', `--outputFile=${output}`, ...args], { stdio: 'inherit' })
  return JSON.parse(readFileSync(output, 'utf8'))
}

/** The checks in verification/: one line per check, named after its step. */
function checks(file) {
  console.log('\n▶ Checks (jest)\n')
  const report = jest(['--config', 'verification/jest.config.mjs', file])
  for (const suite of report.testResults) {
    if (suite.assertionResults.length === 0) record(`Could not run ${file}`, false, suite.message.split('\n')[0])
    for (const test of suite.assertionResults) record(test.title, test.status === 'passed')
  }
}

/**
 * Tests written by the class: they must exist, pass, have no it.todo left, and
 * fail against each mutant (a copy of the code with a planted bug).
 */
function yourTests(mutants) {
  const files = [...new Set(mutants.map(({ spec }) => spec))]
  const missing = files.filter((file) => !existsSync(file))
  for (const file of missing) record(`The file ${file} exists`, false, 'create it')
  if (missing.length > 0) return

  console.log('\n▶ Your tests (jest)\n')
  const report = jest(files)
  record(
    'Every test passes',
    report.numTotalTests > 0 && report.numFailedTests === 0 && report.numRuntimeErrorTestSuites === 0,
    `${report.numPassedTests} passed, ${report.numFailedTests} failed`,
  )
  record('No it.todo left', report.numTodoTests === 0, `${report.numTodoTests} todo`)

  console.log('\n▶ Planted bugs: your tests must fail against each mutant\n')
  for (const { id, label, bug, spec } of mutants) {
    const { status } = spawnSync('npx', ['jest', '--ci', '--silent', '--config', 'verification/jest.mutants.config.mjs', spec], {
      env: { ...process.env, MUTANT: id },
      stdio: 'ignore',
    })
    record(`${label}: the tests catch the bug "${bug}"`, status !== 0, status !== 0 ? 'caught' : 'the bug went unnoticed')
  }
}

const TARGETS = {
  'class-1': () => checks('verification/class-1.check.tsx'),
  'class-2': () =>
    yourTests([
      { id: 'pagination', label: 'Step 1', bug: 'Math.floor in the page count', spec: 'src/search/pagination.test.ts' },
      { id: 'filter', label: 'Step 2', bug: 'every kind links to /busca', spec: 'src/components/KindFilter.test.tsx' },
      { id: 'sort', label: 'Step 3', bug: 'changing the order keeps the page', spec: 'src/components/SortSelect.test.tsx' },
    ]),
  'challenge-1': () => checks('verification/challenge-1.check.tsx'),
  'challenge-2': () =>
    yourTests([
      { id: 'highlight', label: 'Unit', bug: 'the highlight loses the accents', spec: 'src/search/highlight.test.ts' },
      { id: 'pages', label: 'Component', bug: 'the page links drop the order', spec: 'src/components/Pagination.test.tsx' },
      { id: 'document', label: 'Integration', bug: 'an unknown document is not a 404', spec: 'tests/pages/document-page.test.ts' },
    ]),
}

if (!TARGETS[target]) {
  console.error(`Usage: node scripts/verify.mjs ${Object.keys(TARGETS).join(' | ')}`)
  process.exit(2)
}

compiler()
TARGETS[target]()

console.log('\nSummary')
for (const { name, passed, detail } of results) {
  console.log(`  ${passed ? '✓' : '✗'} ${name}${detail ? ` (${detail})` : ''}`)
}
if (results.every(({ passed }) => passed)) {
  console.log('\nAll good.')
} else {
  console.log('\nSomething is still missing: read the ✗ lines above. A bug that "went unnoticed" means a behavior has no test yet.')
  process.exit(1)
}
