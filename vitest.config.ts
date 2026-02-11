import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['html']
    },
    include: [
      'test/**/*.test.ts'
    ],
    reporters: ['verbose'],
    bail: 1,
    isolate: false
  }
})
