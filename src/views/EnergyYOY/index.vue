<template>
  <div class="EnergyYOY flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.year" type="year" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button>
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一年
              </el-button>
              <el-button>
                下一年<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="chart-box">
          <ECharts :option="option" />
        </div>
        <div class="table-box">
          <PaginationTable :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { reactive } from "vue";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ECOption } from "@/components/Charts/config";
import ECharts from "@/components/Charts/echarts.vue";
import data from "./data.json";

const formInline = reactive({
  type: "yuebao",
  year: "2024",
  time: "1min"
});

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const columns = [
  { prop: "fDate", label: "月份" },
  { prop: "fDayvalue", label: "本期" },
  { prop: "pervalue", label: "同期" },
  { prop: "transformername", label: "同比(%)" },
  { prop: "transformername", label: "累计同比(%)" }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: data.data.monthValueListUpToNow, total: 12 });
  });
};

const option: ECOption = {
  grid: {
    left: 10,
    right: 10,
    bottom: 10,
    top: 64,
    containLabel: true
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999"
      }
    }
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ["正向有功电度", "反向有功电度", "正向无功电度", "反向无功电度"]
  },
  xAxis: [
    {
      type: "category",
      data: data.data.monthValueListUpToNow.map(({ fDate }) => fDate),
      axisPointer: {
        type: "shadow"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "有功电度/无功电度"
    }
  ],
  series: [
    {
      name: "本期",
      type: "bar",
      data: data.data.monthValueListUpToNow.map(({ fDayvalue }) => fDayvalue || 0)
    },
    {
      name: "同期",
      type: "bar",
      data: data.data.monthValueListUpToNow.map(({ pervalue }) => pervalue || 0)
    }
  ]
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
