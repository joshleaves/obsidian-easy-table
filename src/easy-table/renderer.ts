import type { EasyTableBlock, EasyTableRow, EasyTableValue } from './types'

interface Column {
  key: string
  label: string
}

interface RenderEasyTableOptions {
  locale?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toColumnLabel(key: string): string {
  return key
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function deriveColumns(rows: EasyTableRow[]): Column[] {
  const seen = new Set<string>()
  const columns: Column[] = [{ key: 'name', label: 'Name' }]

  for (const row of rows) {
    for (const key of Object.keys(row.fields)) {
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      columns.push({
        key,
        label: toColumnLabel(key),
      })
    }
  }

  return columns
}

function renderMarkdownCell(markdown: string): string {
  return `<div class="easy-table-markdown">${escapeHtml(markdown)}</div>`
}

function createNumberFormatter(locale?: string): Intl.NumberFormat {
  if (!locale) {
    return new Intl.NumberFormat()
  }

  try {
    return new Intl.NumberFormat(locale)
  } catch {
    return new Intl.NumberFormat()
  }
}

function normalizeSpecialStringField(key: string, value: string): string {
  const normalizedKey = key.trim().toLowerCase()
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return value
  }

  if (normalizedKey === 'photo' && !trimmedValue.startsWith('![')) {
    return `![](${trimmedValue})`
  }

  if (normalizedKey === 'link' && !trimmedValue.startsWith('[')) {
    return `[Open](${trimmedValue})`
  }

  return value
}

function renderValueCell(key: string, value: EasyTableValue | undefined, numberFormatter: Intl.NumberFormat): string {
  if (typeof value === 'boolean') {
    return renderMarkdownCell(value ? '✅' : '❌')
  }

  if (typeof value === 'number') {
    return renderMarkdownCell(numberFormatter.format(value))
  }

  if (Array.isArray(value)) {
    return renderMarkdownCell(value.join(', '))
  }

  if (typeof value === 'string') {
    return renderMarkdownCell(normalizeSpecialStringField(key, value))
  }

  return ''
}

function renderRow(row: EasyTableRow, columns: Column[], rowIndex: number, numberFormatter: Intl.NumberFormat): string {
  const cells = columns.map((column) => {
    if (column.key === 'name') {
      return `<td class="easy-table-name">${renderMarkdownCell(row.name)}</td>`
    }

    return `<td class="easy-table-cell" data-key="${escapeHtml(column.key)}">${renderValueCell(column.key, row.fields[column.key], numberFormatter)}</td>`
  })

  return [
    '<tr class="easy-table-precontent">',
    `<td class="easy-table-precontent-cell" colspan="${columns.length}">`,
    '<div class="easy-table-precontent-inner">',
    `<span class="easy-table-precontent-title">${escapeHtml(row.name)}</span>`,
    `<span class="easy-table-precontent-meta">Row ${rowIndex + 1}</span>`,
    '</div></td>',
    '</tr>',
    '<tr class="easy-table-content">',
    ...cells,
    '</tr>'
  ].join('')
}

export function renderEasyTableHtml(block: EasyTableBlock, options: RenderEasyTableOptions = {}): string {
  const columns = deriveColumns(block.rows)
  const numberFormatter = createNumberFormatter(options.locale)
  const parts: string[] = ['<section class="easy-table-collection">', '<table class="easy-table">']

  parts.push('<thead><tr>')
  for (const column of columns) {
    parts.push(`<th scope="col" data-column-key="${escapeHtml(column.key)}">${escapeHtml(column.label)}</th>`)
  }

  parts.push('</tr></thead>')

  parts.push('<tbody>')
  for (let i = 0; i < block.rows.length; i += 1) {
    const row = block.rows[i]

    if (!row) {
      continue
    }

    parts.push(renderRow(row, columns, i, numberFormatter))
  }

  parts.push('</tbody></table></section>')

  return parts.join('')
}
