<template>
  <div class="table">
    <el-table :data="tableData" v-bind="tableAttributes" v-on="onEvents">
      <!-- 表格列 -->
      <!-- <component :is="TableColumn" :columns="tableColumns"> </component> -->
      <TableColumn v-for="(item, index) in tableColumns" :columns="item" :key="index"></TableColumn>
    </el-table>
  </div>
  <div class="pagination" v-if="currentPage && pageSize && currentChange && sizeChange">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
      :page-sizes="[100, 200, 300, 400]"
      layout="sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script setup lang="ts">
import TableColumn from './components/TableColumn.vue'
import { getBasicTableData } from './helps/propsData'
import { handleTableData } from './helps/table'
import { handlePaginationData } from './helps/pagination'
import { computed } from 'vue'
// 属性
const props = defineProps(getBasicTableData())

const getProps = computed(() => {
  return { ...props }
})

const { tableAttributes, tableData, tableColumns } = handleTableData(getProps)

const { currentPage, pageSize, total, currentChange, sizeChange } = handlePaginationData(getProps)

// 事件
const emits = defineEmits([
  'selection-change',
  'cell-click',
  'row-click',
  'header-click',
  'filter-change'
])
const onEvents = {
  'selection-change': emits('selection-change'),
  'cell-click': emits('cell-click'),
  'row-click': emits('row-click'),
  'header-click': emits('header-click'),
  'filter-change': emits('filter-change')
}
</script>

<style lang="scss" scoped></style>
