// Checks an exercise. Usage:
//   npm run verify:class-1     exercise 1: doctrine in the search
//   npm run verify:class-2     exercise 2: your tests pass and catch planted bugs
//   npm run verify:challenge   the autocomplete challenge
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
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

/** One line per check, named after its step. */
function checks(file) {
  console.log('\n▶ Exercise checks (jest)\n')
  const report = jest(['--config', 'verification/jest.config.mjs', file])
  for (const suite of report.testResults) {
    if (suite.assertionResults.length === 0) record(`Could not run ${file}`, false, suite.message.split('\n')[0])
    for (const test of suite.assertionResults) record(test.title, test.status === 'passed')
  }
}

const EXERCISE_2_TESTS = ['src/search/pagination.test.ts', 'src/components/KindFilter.test.tsx', 'src/components/SortSelect.test.tsx']
const MUTANTS = [
  { id: 'pagination', step: 'Step 1', bug: 'Math.floor in the page count', spec: EXERCISE_2_TESTS[0] },
  { id: 'filter', step: 'Step 2', bug: 'every kind links to /busca', spec: EXERCISE_2_TESTS[1] },
  { id: 'sort', step: 'Step 3', bug: 'changing the order keeps the page', spec: EXERCISE_2_TESTS[2] },
]

function exercise2() {
  console.log('\n▶ Your tests (jest)\n')
  const report = jest(EXERCISE_2_TESTS)
  record(
    'Every test passes',
    report.numFailedTests === 0 && report.numRuntimeErrorTestSuites === 0,
    `${report.numPassedTests} passed, ${report.numFailedTests} failed`,
  )
  record('No it.todo left', report.numTodoTests === 0, `${report.numTodoTests} todo`)

  console.log('\n▶ Planted bugs: your tests must fail against each mutant\n')
  for (const { id, step, bug, spec } of MUTANTS) {
    const { status } = spawnSync('npx', ['jest', '--ci', '--silent', '--config', 'verification/jest.mutants.config.mjs', spec], {
      env: { ...process.env, MUTANT: id },
      stdio: 'ignore',
    })
    record(`${step}: the tests catch the bug "${bug}"`, status !== 0, status !== 0 ? 'caught' : 'the bug went unnoticed')
  }
}

const TARGETS = {
  'class-1': () => checks('verification/class-1.check.tsx'),
  'class-2': exercise2,
  challenge: () => checks('verification/challenge.check.tsx'),
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
  console.log('\nSomething is still missing: read the ✗ lines above.')
  process.exit(1)
}
