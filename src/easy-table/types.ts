export type EasyTableValue = string | number | boolean | string[]

export interface EasyTableRow {
  name: string
  fields: Record<string, EasyTableValue>
}

export interface EasyTableBlock {
  rows: EasyTableRow[]
}
