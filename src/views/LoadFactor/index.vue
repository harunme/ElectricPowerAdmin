<template>
  <div class="LoadFactor flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.type" placeholder="Activity zone" clearable>
              <el-option label="月报" value="yuebao" />
              <el-option label="年报" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button>
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button>
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
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
        <PaginationTable :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="LoadFactor">
import { reactive } from "vue";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ECOption } from "@/components/Charts/config";
import ECharts from "@/components/Charts/echarts.vue";
import data from "./data.json";

const formInline = reactive({
  type: "yuebao",
  date: "",
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
  { prop: "fSubname", label: "回路名称" },
  { prop: "fTransname", label: "日期" },
  {
    label: "有功功率(kW)",
    children: [
      { prop: "fSubname", label: "平均值" },
      { prop: "fSubname", label: "最大值" }
    ]
  },
  { prop: "transformername", label: "负荷率(%)" }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], total: 0 });
  });
};

const option: ECOption = {
  grid: {
    left: 10,
    right: 10,
    bottom: 10,
    top: 30,
    containLabel: true
  },
  // tooltip: {
  //   trigger: "axis",
  //   axisPointer: {
  //     type: "cross",
  //     crossStyle: {
  //       color: "#999"
  //     }
  //   }
  // },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  // legend: {
  //   data: ["负荷率"]
  // },
  xAxis: [
    {
      type: "category",
      data: data.data.map(({ F_CollectDate }) => F_CollectDate),
      axisPointer: {
        type: "shadow"
      }
    }
  ],
  yAxis: {
    name: "负荷率",
    type: "value"
  },
  series: [
    {
      // name: "负荷率",
      type: "line",
      // yAxisIndex: 1,
      smooth: 0.6,
      lineStyle: {
        color: "#ffba00",
        width: 3
      },
      data: data.data.map(({ F_LoadRate }) => F_LoadRate)
    }
  ]
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
