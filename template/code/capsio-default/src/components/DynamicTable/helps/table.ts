import type { TableColumnForm } from '../types'
import { ref, watchEffect } from 'vue'

export const handleTableData = (getProps: any) => {
  const tableAttributes = ref<any>(getProps.value.tableAttributes) // Table表的属性设置
  const tableData = ref<any>(getProps.value.tableData) // Table数据
  const tableColumns = ref<TableColumnForm[]>(getProps.value.tableColumns) // Table中的列配置项

  // 监听数据变化
  watchEffect(() => {
    tableAttributes.value = getProps.value.tableAttributes
    tableData.value = getProps.value.tableData
    tableColumns.value = getProps.value.tableColumns
  })
  return {
    tableAttributes,
    tableData,
    tableColumns
  }
}
