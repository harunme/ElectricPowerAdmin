<template>
  <div class="DistributDiagram">
    <div class="controls">
      <el-button type="primary" icon="Rank" @click="isFullScreen = true">全屏</el-button>
      <el-button type="primary" icon="ZoomIn" @click="svgpanzoom.zoomIn()">放大</el-button>
      <el-button type="primary" icon="ZoomOut" @click="svgpanzoom.zoomOut()">缩小</el-button>
    </div>
    <div :class="isFullScreen ? 'fullScreen' : 'content'">
      <el-icon v-if="isFullScreen" class="close-icon" @click="isFullScreen = false">
        <CloseBold />
      </el-icon>
      <object id="demo-tiger" type="image/svg+xml" @load="onSvgLoaded" data="/配电图.svg" style="width: 100%; height: 100%">
        Your browser does not support SVG
      </object>
    </div>
  </div>
</template>

<script setup lang="ts" name="DistributDiagram">
import { ref } from "vue";
//
const isFullScreen = ref<boolean>(false);
const svgpanzoom = ref<any>(null);

const onSvgLoaded = () => {
  svgpanzoom.value = svgPanZoom("#demo-tiger", {
    zoomEnabled: true
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
