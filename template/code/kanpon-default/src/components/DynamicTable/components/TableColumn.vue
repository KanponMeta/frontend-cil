<template>
  <el-table-column
    v-if="getProps.columns.children"
    :label="getProps.columns.label"
    :key="getProps.columns.prop"
  >
    <template v-for="item in getProps.columns.children" :key="item.key">
      <TableColumn :columns="item"> </TableColumn>
    </template>
    <!-- <el-table-column v-bind="item" :key="`${item.prop}-else`"> </el-table-column>
  <el-table-column :label="item.children[0].label" :prop="item.children[0].prop" :key="`${item.prop}-else`">
  </el-table-column> -->
  </el-table-column>

  <el-table-column v-else v-bind="getProps.columns" :key="`${getProps.columns.prop}-else`">
  </el-table-column>
  <!-- <el-table-column v-bind="getProps.columns" :key="getProps.columns.key"
    :width="getProps.columns.width || ''"></el-table-column> -->
</template>

<script setup lang="ts" name="TableColumn">
import type { TableColumnForm } from '../types'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Object as PropType<TableColumnForm>,
    default: () => ({})
  }
})

const getProps = computed(() => {
  return { ...props }
})
</script>

<style scoped lang="scss"></style>
