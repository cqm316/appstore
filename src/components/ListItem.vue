<!--
 * @Author: chenqiaomin
 * @Date: 2024-09-25 22:50:07
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 17:14:56
 * @FilePath: appstore\src\components\ImageItem.vue
 * @Description: list项
-->

<template>
  <div class="van-list-item" @click="toDetails">
    <van-image
      width="4rem"
      height="4rem"
      fit="cover"
      position="center"
      :radius="isEven ? '50%' : '10px'"
      :src="imageUrl"
      :round="isEven"
    />
    <div class="van-list-item__content">
      <h3 class="title">{{name}}</h3>
      <p class="describe">{{category}}</p>
      <van-rate
        v-model="rate"
        :size="14"
        color="#ffd21e"
        void-color="#ffd21e"
        allow-half
        readonly
      />
      <em class="count">({{commentsNum}})</em>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue';

const props = defineProps({
  // 应用id
  id: {
    type: [Number, String] as PropType<number | string>,
    required: true
  },
  // 是否是偶数
  isEven: {
    type: Boolean,
    default: true
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
const rate = ref(props.rate);

// 跳转到详情
function toDetails() {
  window.open(props.detailUrl, '_blank')
}
</script>


<style lang="less" scoped>
@import "@/styles/mixins.less";
.van-list-item {
  display: flex;
  gap: @gap;
  &__content {
    flex: 1;
    max-width: calc(100% - 4rem - @gap);
    margin-top: -2px;
    text-align: left;
    .title {
      margin-bottom: 6px;
      color: var(--color-text-1);
      .ellipsis();
    }
    .describe {
      margin: 4px 0 2px 0;
      font-size: 0.8rem;
      color: var(--color-text-3);
      .ellipsis();
    }
    .count {
      padding-left: 3px;
      font-style: normal;
      font-size: 0.6rem;
    }
  }
}
</style>
