import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'

// 路由模块化的自动导入
const modules = import.meta.glob('./modules/*.ts', {
  eager: true,
  import: 'default'
})

const formatModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key]
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

const appRoutes: RouteRecordNormalized[] = formatModules(modules, [])
const router = createRouter({
  history: createWebHashHistory(),
  routes: appRoutes
})

router.beforeEach((to: RouteLocationNormalized) => {
  return true
})

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (from.path === '/login') {
    window.location.reload()
  }
})

export default router
