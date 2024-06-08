<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card chart-box"></div>
      <div class="card table-box"></div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import TransformerSelect from "@/components/TransformerSelect/index.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
