import { ref, watchEffect } from 'vue'

export const handlePaginationData = (getProps: any) => {
  if (!getProps.value.pagination)
    return {
      currentPage: null,
      pageSize: null,
      total: null,
      currentChange: null,
      sizeChange: null
    }
  // const { currentPage, pageSize, total, currentChange, sizeChange } = toRefs<Pagination>(getProps.value.pagination)
  const currentPage = ref<number>(getProps.value.currentPage)
  const pageSize = ref<number>(getProps.value.pageSize)
  const total = ref<number>(getProps.value.total)
  const { currentChange, sizeChange } = getProps.value.pagination

  // 监听数据变化
  watchEffect(() => {
    currentPage.value = getProps.value.pagination.currentPage
    pageSize.value = getProps.value.pagination.pageSize
    total.value = getProps.value.pagination.total
  })
  return {
    currentPage,
    pageSize,
    total,
    currentChange,
    sizeChange
  }
}
