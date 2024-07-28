<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
          <template #label>
            <el-icon v-if="item.icon && tabsIcon" class="tabs-icon">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tool-box">
      <div class="alarm">
        <el-badge
          v-for="level in alarmInfo"
          :key="level.text"
          :style="`background-color: ${level.color};`"
          :value="level.count"
          :max="10"
          class="item"
          :hidden="Number(level.count) === 0"
          @click="toAlarmInfo(level.eventtype)"
        >
          <span>{{ level.text }}</span>
        </el-badge>
      </div>
      <div class="user">
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-icon size="26"><UserFilled /></el-icon>
          </template>
          <el-button @click="logout" type="text">退出登录</el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOGIN_URL } from "@/config";
import Sortable from "sortablejs";
// import router from "@/routers";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/modules/global";
import { useTabsStore } from "@/stores/modules/tabs";
import { useAuthStore } from "@/stores/modules/auth";
import { TabsPaneContext, TabPaneName } from "element-plus";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { getUnConfirmedEventsByCache } from "@/api/modules/main";

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();

const tabsMenuValue = ref(route.fullPath);
const alarmInfo = ref<{ text: string; count: number; color: string }[]>([]);
const tabsMenuList = computed(() => tabStore.tabsMenuList);
const tabsIcon = computed(() => globalStore.tabsIcon);

onMounted(() => {
  tabsDrop();
  initTabs();
  GetUnConfirmedEventsByCache();

  window.setInterval(GetUnConfirmedEventsByCache, 5000);
});

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    tabsMenuValue.value = route.fullPath;
    console.log(route.fullPath);
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !route.meta.isAffix,
      isKeepAlive: route.meta.isKeepAlive as boolean
    };
    tabStore.addTabs(tabsParams);
  },
  { immediate: true }
);

const logout = () => {
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    // 1.执行退出登录接口
    // await logoutApi();

    // 2.清除 Token
    userStore.setToken("");

    // 3.重定向到登陆页
    router.replace(LOGIN_URL);
    ElMessage.success("退出登录成功！");
  });
};

// 初始化需要固定的 tabs
const initTabs = () => {
  authStore.flatMenuListGet.forEach(item => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix,
        isKeepAlive: item.meta.isKeepAlive
      };
      tabStore.addTabs(tabsParams);
    }
  });
};

// tabs 拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
    draggable: ".el-tabs__item",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...tabStore.tabsMenuList];
      const currRow = tabsList.splice(oldIndex as number, 1)[0];
      tabsList.splice(newIndex as number, 0, currRow);
      tabStore.setTabs(tabsList);
    }
  });
};

// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
  const fullPath = tabItem.props.name as string;
  router.push(fullPath);
};

// Remove Tab
const tabRemove = (fullPath: TabPaneName) => {
  tabStore.removeTabs(fullPath as string, fullPath == route.fullPath);
};

const GetUnConfirmedEventsByCache = async () => {
  const { numsByLevel }: any = await getUnConfirmedEventsByCache();
  const colors = ["#13ce66", "#ffba00", "#ff4949"];
  alarmInfo.value = numsByLevel.map(({ eventname, eventcount, eventtype }, index) => ({
    text: eventname,
    count: eventcount,
    color: colors[index],
    eventtype: eventtype
  }));
};

const toAlarmInfo = eventtype => {
  router.push(`/AlarmInfo?messinfolevel=${eventtype}`);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
