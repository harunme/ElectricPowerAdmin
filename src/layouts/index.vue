<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents[layout]" />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from "vue";
import { LayoutType } from "@/stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import LayoutVertical from "./LayoutVertical/index.vue";

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical
};

const globalStore = useGlobalStore();
const layout = computed(() => globalStore.layout);
</script>

<style scoped lang="scss">
.layout {
  min-width: 800px;
}
</style>
