<!--
 * @Author: chenqiaomin
 * @Date: 2024-09-25 00:36:16
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 18:07:46
 * @FilePath: appstore\src\views\List.vue
 * @Description: list 页面
-->
<template>
  <main class="app-content">
    <van-search
      class="app-search"
      v-model.trim="searchValue"
      shape="round"
      placeholder="search..."
      @search="onSearch"
      @clear="onClear"
    />
    <van-empty
      description="暂无数据"
      v-if="
        !loading &&
        (!grossingData || grossingData.length === 0) &&
        (!freeData || freeData.length === 0)
      "
    />
    <div class="app-bar" v-if="grossingData && grossingData.length > 0">
      <div class="image-items">
        <ImageItem
          class="image-item"
          v-for="item in grossingData"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :category="item.category"
          :rate="item.rate"
          :commentsNum="item.commentsNum"
          :imageUrl="item.imageUrl"
          :detailUrl="item.detailUrl"
        />
      </div>
    </div>
    <van-list
      class="app-list"
      v-model:loading="loading"
      :finished="finished"
      loading-text="加载中..."
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in freeData" :key="item.id" :title="index + 1">
        <ListItem
          :id="item.id"
          :isEven="isEven(index + 1)"
          :name="item.name"
          :category="item.category"
          :rate="item.rate"
          :commentsNum="item.commentsNum"
          :imageUrl="item.imageUrl"
          :detailUrl="item.detailUrl"
        />
      </van-cell>
    </van-list>
    <van-floating-bubble
      v-model:offset="offset"
      icon="replay"
      magnetic="x"
      axis="xy"
      @click="onShowRefreshDialog"
    />
    <van-dialog
      v-model:show="showRefreshDialog"
      title="是否强制刷新更新最新数据"
      show-cancel-button
      @confirm="onRefresh"
    />
    <van-back-top />
  </main>
</template>

<script setup lang="ts">
import ImageItem from "@/components/ImageItem.vue";
import ListItem from "@/components/ListItem.vue";
import { getGrossingApplications, getFreeApplications, getRateCount } from "@/apis";
import { convertDataTypes, isEven, storage, pwaInit, toUpperCaseFn } from "@/utils";
import { onMounted, ref } from "vue";
import { resultData } from "@/types";

const firstLoad = ref(true); // 是否是首次加载
const loading = ref(false);
const finished = ref(false);
const showRefreshDialog = ref(false);
const grossingData = ref<resultData[]>([]); // 顶部推荐APP列表
const freeData = ref<resultData[]>([]); // 免费APP列表
const searchValue = ref("");
const offset = ref({ x: 320, y: 200 }); // 刷新按钮位置
const page = ref<number>(1);

let dataFree: resultData[] = []; // 缓存免费APP列表
let dataGrossing: resultData[] = []; // 缓存顶部推荐APP列表

onMounted(() => {
  getGrossingAppList();
  pwaInit();
});

// 获取 顶部推荐APP列表
async function getGrossingAppList() {
  const dataGrossingDB = await storage.getItem("GROSSING_App_LIST");
  if (dataGrossingDB && dataGrossingDB.length > 0) {
    grossingData.value = dataGrossing  = dataGrossingDB as resultData[];
    return;
  }
  const resultGrossing = await getGrossingApplications(10);
  dataGrossing = convertDataTypes([...(resultGrossing?.feed?.entry || [])]);
  storage.setItem("GROSSING_App_LIST", dataGrossing);
  grossingData.value = dataGrossing as resultData[];
}

// 获取 免费APP列表
async function returnFreeApplications() {
  const dataFreeDB: resultData[] = await storage.getItem("FREE_APP_LIST");
  if (dataFreeDB && dataFreeDB.length > 0) {
    dataFree = dataFreeDB as resultData[];
    return;
  }
  const resultFree = await getFreeApplications(100);
  const FreeApps: resultData[] = resultFree?.feed?.entry || [];
  const ids = FreeApps && FreeApps.map((item: any) => item.id?.attributes["im:id"]);

  const dataRateCount: Array<any> = [];
  // 并发获取 rating 数量 以及 评论数
  // 这里尝试过一次性请求 100 个 id 的数据，有时候会请求超时，所以分批请求
  Promise.allSettled([
    getRateCount(ids.slice(0, 25).toString()),
    getRateCount(ids.slice(25, 50).toString()),
    getRateCount(ids.slice(50, 75).toString()),
    getRateCount(ids.slice(75, 101).toString()),
  ]).then(async (results) => {
    results.map((item) => {
      if (item.status === "fulfilled") {
        const datas: Array<any> = item?.value?.results || [];
        dataRateCount.push(...datas);
      }
    });
    dataFree = convertDataTypes(resultFree?.feed?.entry || [], dataRateCount);
    storage.setItem("FREE_APP_LIST", dataFree);
  });
}

// 列表加载更新
const onLoad = async () => {
  loading.value = true;

  // 异步更新数据
  if (firstLoad.value) {
    returnFreeApplications();
  }

  firstLoad.value = false;
  setTimeout(() => {
    freeData.value.push(...dataFree.slice(10 * (page.value - 1), 10 * page.value));
    // 加载状态结束
    loading.value = false;
    page.value++;

    // 数据全部加载完成
    if (freeData.value.length === 101 || page.value === 11) {
      finished.value = true;
    }
  }, 1000);
};

// 搜索
const onSearch = (e) => {
  const searchVal = toUpperCaseFn(e);
  const searchFree = (dataFree as resultData[]).filter((item) => 
    toUpperCaseFn(item.description).indexOf(searchVal) !== -1);
  const searchGrossing = (dataGrossing as resultData[]).filter(
    (item) => toUpperCaseFn(item.description).indexOf(searchVal) !== -1
  );
  grossingData.value = searchGrossing;
  freeData.value = searchFree;
};

// 清楚搜索
const onClear = () => {
  searchValue.value = "";
  grossingData.value = dataGrossing;
  freeData.value = dataFree;
};
// 弹出刷新提示框
const onShowRefreshDialog = () => {
  showRefreshDialog.value = true;
};

// 强制刷新页面
const onRefresh = async () => {
  storage.clear();
  location.reload();
};
</script>

<style lang="less" scoped>
.app-content {
  height: 100%;
  padding-top: 54px;
  .app-search {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .app-bar {
    padding: @gap @gap 0 @gap;
    border-bottom: 1px solid @border-color;
    overflow: hidden;
    .image-items {
      width: auto;
      display: flex;
      flex-wrap: nowrap;
      padding-bottom: @gap;
      overflow-x: scroll;
      gap: @gap;
      .image-item {
        flex: 0 0 auto;
      }
    }
  }
}
</style>
