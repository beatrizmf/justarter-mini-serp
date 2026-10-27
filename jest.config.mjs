import nextJest from 'next/jest.js'

// next/jest sets up SWC for TypeScript and JSX, and reads next.config.
const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  // The exercise checks live in verification/ and only run with `npm run verify:*`.
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'pages/**/*.{ts,tsx}', '!**/*.d.ts'],
}

export default createJestConfig(config)
