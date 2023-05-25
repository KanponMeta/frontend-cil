<template>
  <el-aside class="aside">
    <div class="aside-content">
      <!-- <el-image class="image-log" :src="Logo" fit="fill" /> -->
      <el-menu :default-active="activeKey" :collapse="false" :router="true">
        <loopMenu v-for="item in menuStore.menus" :key="item.index" :data="item"> </loopMenu>
      </el-menu>
    </div>
  </el-aside>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '../../../stores'
import loopMenu from './MenuItem.vue'
// import Logo from "@/assets/images/logo.png";

const route = useRoute()
const menuStore = useMenuStore()
const activeKey = ref('/dashboard/test')

/**
 * @desc 递归获取目录中的路径
 */

const getMenuKeys = (params: MenuItemForm[]) => {
  const keys: string[] = []
  const forTree = (menus: MenuItemForm[]) => {
    menus.forEach((menuItem) => {
      if (menuItem.path) {
        keys.push(menuItem.path)
      }
      if (menuItem.children?.length) {
        forTree(menuItem.children)
      }
    })
  }

  forTree(params)

  return keys
}
const menuKeyList = getMenuKeys(menuStore.menus)

// 监听路由变化， 高亮被选中目录
watch(
  () => route.path,
  (newVal) => {
    if (!menuKeyList.includes(newVal)) return
    activeKey.value = newVal
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.aside {
  .aside-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;

    box-sizing: border-box;
    height: calc(100vh - 60px);
    margin: 30px;

    background-color: white;
    border-radius: 10px;
  }
}

.el-menu {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 50px;
  width: 100%;
  height: 50%;
  border-right: none;
}
</style>
