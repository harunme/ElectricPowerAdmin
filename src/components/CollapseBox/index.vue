<template>
  <div :class="`${isCollapse ? 'collapsed' : ''} CollapseBox`" :style="width ? `width:${width}px` : ''">
    <div class="content">
      <slot></slot>
    </div>
    <img :src="CollapseIcon" @click="isCollapse = !isCollapse" />
  </div>
</template>

<script setup lang="tsx" name="CollapseBox">
import { ref } from "vue";
import CollapseIcon from "./collapse.svg";
const isCollapse = ref(false);
const props = defineProps<{
  width?: number;
}>();
console.log("props", props);
</script>

<style scoped lang="scss">
@import "./index";
</style>
