<template>
  <div class="echarts">
    <ECharts :option="option" />
  </div>
</template>

<script setup lang="ts" name="pie">
import { ECOption } from "../config";
import ECharts from "../echarts.vue";

interface PieProps {
  data: { value: number; name: string }[];
}

const props = withDefaults(defineProps<PieProps>(), {
  data: () => []
});

const option: ECOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: "0%",
    left: "2%",

    align: "left",
    textStyle: {
      fontSize: 12,
      color: "#a1a1a1",
      fontWeight: 400
    }
  },
  series: [
    {
      type: "pie",
      radius: "34%",
      center: ["50%", "50%"],
      silent: true,
      clockwise: true,
      data: props.data,

      label: {
        position: "outer",
        show: true,
        fontSize: 12,
        alignTo: "labelLine",
        bleedMargin: 0
      },
      color: [
        {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0.5,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#feb791" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#fe8b4c" // 100% 处的颜色
            }
          ]
        },
        {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0.5,
          colorStops: [
            {
              offset: 0,
              color: "#b898fd" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#8347fd" // 100% 处的颜色
            }
          ]
        }
      ]
    }
  ]
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
