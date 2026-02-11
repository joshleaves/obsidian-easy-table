import type { EasyTableBlock, EasyTableRow, EasyTableValue } from './types'

const NUMBER_PATTERN = /^-?\d+(?:[.,]\d+)?$/

function parseScalarValue(raw: string): EasyTableValue {
  const trimmed = raw.trim()
  const lowered = trimmed.toLowerCase()

  if (lowered === 'true') {
    return true
  }

  if (lowered === 'false') {
    return false
  }

  if (NUMBER_PATTERN.test(trimmed)) {
    const normalized = trimmed.replace(',', '.')
    const numeric = Number.parseFloat(normalized)

    if (!Number.isNaN(numeric)) {
      return numeric
    }
  }

  return raw
}

function parseArrayValue(raw: string): string[] {
  return raw
    .split(',')
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
}

export function parseEasyTableBlock(source: string): EasyTableBlock {
  const rows: EasyTableRow[] = []
  const lines = source.split(/\r?\n/)
  let current: EasyTableRow | null = null

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    if (!trimmed) {
      continue
    }

    if (!trimmed.startsWith('|')) {
      current = {
        name: rawLine.trim(),
        fields: {},
      }
      rows.push(current)
      continue
    }

    if (!current) {
      continue
    }

    const payload = trimmed.slice(1).trim()
    const separatorIndex = payload.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const rawKey = payload.slice(0, separatorIndex).trim()
    const rawValue = payload.slice(separatorIndex + 1).trim()

    if (!rawKey) {
      continue
    }

    if (rawKey.endsWith('[]')) {
      const key = rawKey.slice(0, -2).trim()

      if (!key) {
        continue
      }

      const parsed = parseArrayValue(rawValue)
      const existing = current.fields[key]

      if (Array.isArray(existing)) {
        current.fields[key] = [...existing, ...parsed]
      } else {
        current.fields[key] = parsed
      }

      continue
    }

    current.fields[rawKey] = parseScalarValue(rawValue)
  }

  return { rows }
}
