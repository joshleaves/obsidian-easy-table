import { describe, expect, it } from 'vitest'
import { renderEasyTableHtml } from '../src/easy-table/renderer'
import type { EasyTableBlock } from '../src/easy-table/types'

describe('renderEasyTableHtml', () => {
  it('renders precontent row and typed values', () => {
    const block: EasyTableBlock = {
      rows: [
        {
          name: 'My Milkshake',
          fields: {
            Feature: 'Brings all the boys to the yards',
            Good: true,
            Tags: ['Song', 'Meme'],
            Year: 2009,
            Artist: '[Kelis](http://wikipedia/Kelis)',
            Photo: 'https://images.example/photo.jpg',
            Link: 'https://example.com/item',
          }
        }
      ]
    }

    const html = renderEasyTableHtml(block)

    expect(html).toContain('<tr class="easy-table-precontent">')
    expect(html).toContain('class="easy-table-precontent-cell"')
    expect(html).toContain('<tr class="easy-table-content">')
    expect(html).toContain('<div class="easy-table-markdown">✅</div>')
    expect(html).toContain('<div class="easy-table-markdown">2009</div>')
    expect(html).toContain('<th scope="col" data-column-key="Feature">Feature</th>')
    expect(html).toContain('<th scope="col" data-column-key="Artist">Artist</th>')
    expect(html).toContain('![](https://images.example/photo.jpg)')
    expect(html).toContain('[Open](https://example.com/item)')
    expect(html).toContain('class="easy-table-markdown"')
  })

  it('escapes html in markdown containers', () => {
    const block: EasyTableBlock = {
      rows: [
        {
          name: '<script>alert(1)</script>',
          fields: {
            Note: '<img src=x onerror=alert(1)>'
          }
        }
      ]
    }

    const html = renderEasyTableHtml(block)

    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })
})
