<!--
 * @Author: chenqiaomin
 * @Date: 2024-09-25 22:50:07
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:14:42
 * @FilePath: appstore\src\components\ImageItem.vue
 * @Description: list项
-->
<template>
  <div class="van-image-item" @click="toDetails">
    <van-image
      width="6rem"
      height="6rem"
      fit="cover"
      position="center"
      radius="10px"
      :src="imageUrl"
    />
    <h3 class="title">{{name}}</h3>
    <p class="describe">{{category}}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';
const props = defineProps({
  // 应用id
  id: {
    type: [Number, String] as PropType<number | string>,
    required: true
  },
  // 应用名称
  name: {
    type: String,
    required: true
  },
  // 应用类别
  category: {
    type: [ String, undefined ] as PropType<string | undefined>,
    required: true
  },
  // 应用星级
  rate: Number,
  // 应用评论数
  commentsNum: {
    type: [Number, String] as PropType<number | string>,
    required: false
  },
  // 应用图片地址
  imageUrl: String,
  // 应用详情地址
  detailUrl: String,
});
// 跳转到详情
function toDetails() {
  window.open(props.detailUrl, '_blank')
}
</script>
<style lang="less" scoped>
@import "@/styles/mixins.less";
.van-image-item {
  width: 6rem;
  text-align: center;
  .title {
    margin: 10px 0 5px 0;
    color: var(--color-text-1);
    .ellipsis();
  }
  .describe {
    font-size: 0.8rem;
    color: var(--color-text-3);
    .ellipsis();
  }
}
</style>
