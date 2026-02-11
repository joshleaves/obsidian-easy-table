import { describe, expect, it } from 'vitest'
import { parseEasyTableBlock } from '../src/easy-table/parser'

describe('parseEasyTableBlock', () => {
  it('parses rows and typed values', () => {
    const block = parseEasyTableBlock([
      'My Milkshake',
      '| Feature=Brings all the boys to the yards',
      '| Good=TRUE',
      '| Tags[]=Song,Meme',
      '| Year=2009',
      '| Score=12,5',
      'Your Milkshake',
      '| Cons=It just smells bad, bro',
      '| Good=FALSE',
    ].join('\n'))

    expect(block.rows).toHaveLength(2)

    const first = block.rows[0]
    const second = block.rows[1]

    expect(first?.name).toBe('My Milkshake')
    expect(first?.fields.Feature).toBe('Brings all the boys to the yards')
    expect(first?.fields.Good).toBe(true)
    expect(first?.fields.Tags).toEqual(['Song', 'Meme'])
    expect(first?.fields.Year).toBe(2009)
    expect(first?.fields.Score).toBe(12.5)

    expect(second?.name).toBe('Your Milkshake')
    expect(second?.fields.Cons).toBe('It just smells bad, bro')
    expect(second?.fields.Good).toBe(false)
  })

  it('merges repeated array fields', () => {
    const block = parseEasyTableBlock([
      'Row',
      '| Tags[]=A,B',
      '| Tags[]=C',
    ].join('\n'))

    expect(block.rows[0]?.fields.Tags).toEqual(['A', 'B', 'C'])
  })
})
