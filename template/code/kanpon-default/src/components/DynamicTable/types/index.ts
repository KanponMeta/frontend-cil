export type TableColumnForm = {
  key: string
  label?: string
  prop?: string
  type?: string
  width?: string
  isSlot?: boolean
  children?: TableColumnForm[]
}
