/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 00:36:16
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 00:39:36
 * @FilePath: appstore\src\router\index.ts
 * @Description: router
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('../views/List.vue')
    }
  ]
})

export default router
