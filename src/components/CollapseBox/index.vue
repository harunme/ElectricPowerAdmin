<template>
  <div :class="`${isCollapse ? 'collapsed' : ''} CollapseBox`">
    <div class="content"></div>
    <img :src="CollapseIcon" @click="isCollapse = !isCollapse" />
  </div>
</template>

<script setup lang="tsx" name="CollapseBox">
import { ref } from "vue";
import CollapseIcon from "./collapse.svg";
const isCollapse = ref(false);
</script>

<style scoped lang="scss">
@import "./index";
</style>
