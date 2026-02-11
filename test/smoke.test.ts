import { describe, expect, it } from 'vitest'

describe('smoke', () => {
  it('runs vitest in node mode', () => {
    expect(1 + 1).toBe(2)
  })
})
