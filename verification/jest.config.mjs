import baseConfig from '../jest.config.mjs'

// The exercise checks: same setup as `npm test`, but only the files in verification/.
export default async function config() {
  const base = await baseConfig()
  return { ...base, rootDir: '..', roots: ['<rootDir>/verification'], testMatch: ['**/*.check.ts?(x)'] }
}
