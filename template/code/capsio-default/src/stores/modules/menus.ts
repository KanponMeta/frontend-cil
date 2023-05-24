import { defineStore } from 'pinia'

interface menuState {
  menus: MenuItemForm[]
}

export const useMenuStore = defineStore({
  id: 'menus',
  state: (): menuState => ({
    menus: [
      {
        index: 'home',
        label: '首 页',
        path: '/home'
      },
      {
        index: 'configManagement',
        label: '配置管理',
        path: '/configManagement',
        children: [
          {
            index: '/configManagement/userManagement',
            label: '用 户 管 理',
            path: '/configManagement/userManagement'
          },
          {
            index: '/configManagement/permissionManagement',
            label: '权 限 管 理',
            path: '/configManagement/permissionManagement'
          }
        ]
      }
    ]
  })
})
