import DEFAULT_LAYOUT from '../base'
import type { RouteRecordRaw } from 'vue-router'

const configManagement: RouteRecordRaw = {
  path: '/configManagement',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '配置管理'
  },
  children: [
    {
      path: 'userManagement',
      name: 'userManagement',
      meta: {
        title: '用户'
      },
      component: () => import('@/views/configManagement/userManagement/index.vue')
    },
    {
      path: 'permissionManagement',
      name: 'permissionManagement',
      meta: {
        title: '权限配置'
      },
      component: () => import('@/views/configManagement/permissionManagement/index.vue')
    }
  ]
}

export default configManagement
