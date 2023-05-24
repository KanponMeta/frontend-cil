import DEFAULT_LAYOUT from '../base'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/home/index.vue'

const home: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: DEFAULT_LAYOUT,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '',
        component: Home,
        meta: {
          title: '首页'
        }
      }
    ]
  }
]

export default home
