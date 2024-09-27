/*
 * @Author: chenqiaomin
 * @Date: 2024-09-25 00:36:16
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 01:53:41
 * @FilePath: appstore\src\components\__tests__\ListItem.spec.ts
 * @Description: ListItem 测试
 */
import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ListItem from '../ListItem.vue'

describe('ListItem', () => {
  it('renders properly', () => {
    const wrapper = mount(ListItem, {
      props: { // 应用id
        id: 123213,
        // 应用名称
        name: '测试应用',
        // 应用类别
        category: '娱乐',
        // 应用星级
        rate: 5,
        // 应用评论数
        commentsNum: 900,
        // 应用图片地址
        imageUrl: 'https://img.alicdn.com/imgextra/i4/O1CN0101111X1b11',
        // 应用详情地址
        detailUrl: 'https://www.baidu.com'
      }
    })
    expect(wrapper.text()).toContain('ListItem Vitest')
  })
})
