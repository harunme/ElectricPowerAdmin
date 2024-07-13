<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme">
              <el-option label="日报" value="day" />
              <el-option label="月报" value="month" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="date" />
          </el-form-item>
          <el-form-item label="电力类别">
            <el-select v-model="formInline.param">
              <el-option label="功率" value="P" />
              <el-option label="电流" value="I" />
              <el-option label="电压" value="U" />
              <el-option label="不平衡度" value="UnB" />
              <el-option label="电压谐波" value="UHR" />
              <el-option label="电流谐波" value="IHR" />
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
// import moment from "moment";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ElecMaxMinAvgValue } from "@/api/modules/main";
// import data from "./data.json";

const formInline = reactive<{
  param: "I" | "U" | "P" | "UnB" | "UHR" | "IHR";
  scheme: "day" | "month" | "custom";
  starttime: string;
}>({
  param: "I",
  scheme: "day",
  starttime: "2024-06-01"
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
  { prop: "objectname", label: "回路名称" },
  { prop: "collecttime", label: "日期" },
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
    const params: any = {
      stationid: "000",
      circuitids: "000-001-002",
      scheme: formInline.scheme,
      starttime: formInline.starttime,
      param: "I"
    };
    const { data } = await ElecMaxMinAvgValue(params);
    const list = data?.StatisticValue || [];
    resolve({ list, total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
