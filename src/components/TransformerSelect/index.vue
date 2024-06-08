<template>
  <div class="TransformerSelect">
    <span> 变配电站名称:</span>
    <el-input v-model="input3" style="width: 240px" placeholder="Please input" class="input-with-select">
      <template #append>
        <el-button :icon="Search" />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="tsx" name="TransformerSelect">
import { Search } from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
