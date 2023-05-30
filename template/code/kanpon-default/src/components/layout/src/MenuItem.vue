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
    <div
      :class="getProps.isActived ? 'item-label-active' : 'item-label'"
      v-if="getProps?.data?.label"
    >
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
  },
  isActived: Boolean
})

const getProps = computed(() => {
  return { ...props }
})
</script>

<style lang="scss" scoped>
.el-menu-item {
  height: 10vh;
}

.item-label {
  position: absolute;
  width: 70%;
  height: 6vh;
  padding: 0 15px;

  display: flex;
  align-items: center;

  font-size: 1vw;
  font-family: PingFang SC;
  font-weight: bold;
  color: #434343;

  background: #fff;
  border-radius: 5px;

  &-active {
    position: absolute;
    width: 70%;
    height: 6vh;

    padding: 0 15px;
    display: flex;
    align-items: center;

    font-size: 1vw;
    font-family: PingFang SC;
    font-weight: bold;
    color: #fff;

    background: #92b0ff;
    border-radius: 5px;
  }
}

.item-label::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 0;
  border-color: rgba(0, 0, 0, 0);
  border-top: 3vh solid transparent;
  border-left: 1vh solid #fff;
  border-bottom: 3vh solid transparent;
  border-style: solid;
  border-radius: 5px;
}

.item-label-active::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 0;
  border-color: rgba(0, 0, 0, 0);
  border-top: 3vh solid transparent;
  border-left: 1vh solid #92b0ff;
  border-bottom: 3vh solid transparent;
  border-style: solid;
  border-radius: 5px;
}
</style>
