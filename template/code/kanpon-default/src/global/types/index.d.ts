interface MenuItemForm {
  index: string // 索引
  label: string // 标题
  path: string // 路由跳转的路径
  icon?: string // 图标名称
  activeIcon?: string // 图标选中时的icon
  children?: MenuItemForm[] // 是否有子目录
}
