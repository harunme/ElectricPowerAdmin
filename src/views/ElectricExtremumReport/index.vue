<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
          </el-form-item>
          <el-form-item label="电压类别">
            <el-select v-model="formInline.type">
              <el-option label="全部" value="shanghai" />
              <el-option label="相电压" value="beijing" />
              <el-option label="线电压" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间间隔">
            <el-select v-model="formInline.time">
              <el-option label="一分钟" value="1min" />
              <el-option label="五分钟" value="5min" />
              <el-option label="十五分钟" value="15min" />
              <el-option label="半小时" value="30min" />
              <el-option label="一小时" value="60min" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button>
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
              </el-button>
              <el-button>
                下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { reactive } from "vue";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
// import data from "./data.json";

const formInline = reactive({
  type: "shanghai",
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
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "日期" },
  {
    label: "有功功率(kW)",
    children: [
      {
        label: "最大值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      {
        label: "最小值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      { prop: "3sdf", label: "平均值" }
    ]
  },
  {
    label: "无功功率(kVar)",
    children: [
      {
        label: "最大值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      {
        label: "最小值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      { prop: "3sdf", label: "平均值" }
    ]
  },
  {
    label: "视在功率(kVA)",
    children: [
      {
        label: "最大值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      {
        label: "最小值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      { prop: "3sdf", label: "平均值" }
    ]
  },
  {
    label: "功率因数",
    children: [
      {
        label: "最大值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      {
        label: "最小值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      { prop: "3sdf", label: "平均值" }
    ]
  }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
