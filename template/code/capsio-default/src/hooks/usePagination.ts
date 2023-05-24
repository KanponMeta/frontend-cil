import { reactive, toRefs } from 'vue'

type Callback = () => void

type Options = {
  currentPage: number
  pageSize: number
  total: number
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  currentChange: (val: number, callback: Callback) => void
  sizeChange: (val: number, callback: Callback) => void
}
/**
 * @desc 封装pagination , 缩减代码量
 * @params callback: 页数、size发生改变时执行的回调函数
 * @params options: { currentPage: 1, pageSize: 15, total: 0}
 * @returns currentPage: 当前页
 * @returns pageSize: 当前页的尺寸
 * @returns total: 当前页的总量
 * @returns currentChange: 修改当前页数， 并执行传入的回调函数
 * @returns sizeChange: 修改当前页尺寸， 并执行传入的回调函数
 *
 * */
export const usePagination = (
  callback: Callback,
  options: Options = { currentPage: 1, pageSize: 15, total: 0 }
) => {
  const pagination: Pagination = reactive({
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    total: options.total,
    currentChange: (val: number) => {
      pagination.currentPage = val
      callback && callback()
    },
    sizeChange: (val: number) => {
      pagination.pageSize = val
      callback && callback()
    }
  })

  const currentChange = pagination.currentChange

  const sizeChange = pagination.sizeChange

  const setTotal = (val: number) => {
    pagination.total = val
  }

  const { currentPage, pageSize, total } = toRefs(pagination)

  return {
    currentPage,
    pageSize,
    total,
    pagination,
    currentChange,
    sizeChange,
    setTotal
  }
}
