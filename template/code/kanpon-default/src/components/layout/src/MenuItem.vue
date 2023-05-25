<template>
  <!-- 数据有嵌套关系 -->
  <el-sub-menu v-if="getProps.data?.children?.length" :index="getProps.data.path">
    <template #title>
      <div class="item-label" v-if="getProps?.data?.label">
        {{ getProps.data.label }}
      </div>
      <div v-if="getProps?.data?.icon" class="item-icon" v-html="getProps?.data?.icon"></div>
    </template>
    <MenuItem v-for="item in getProps.data.children" :key="item.index" :data="item"> </MenuItem>
  </el-sub-menu>
  <!-- 数据没有嵌套关系 -->
  <el-menu-item v-else :index="getProps.data.path">
    <div class="item-label" v-if="getProps?.data?.label">
      {{ getProps.data.label }}
    </div>
    <div v-if="getProps?.data?.icon" class="item-icon" v-html="getProps?.data?.icon"></div>
  </el-menu-item>
</template>

<script lang="ts" setup name="MenuItem">
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<MenuItemForm>,
    default: () => null
  }
})

const getProps = computed(() => {
  return { ...props }
})
</script>

<style lang="scss" scoped>
.item-label {
  font-weight: 500;
  font-family: PingFang SC;
  color: #aaaaaa;
  font-size: 1.25vw;
  text-align: center;
}
</style>
