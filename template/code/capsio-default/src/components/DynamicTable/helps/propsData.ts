import type { PropType } from 'vue'
import type { Pagination } from '@/hooks/usePagination'
import type { TableColumnForm } from '../types/index'

export const getBasicTableData = () => {
  return {
    tableAttributes: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({})
    },
    tableColumns: {
      type: Array as PropType<TableColumnForm[]>,
      default: () => [{}]
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object as PropType<Pagination>,
      default: () => null
    }
  }
}
