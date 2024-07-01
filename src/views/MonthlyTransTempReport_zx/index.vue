<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="月份">
            <el-date-picker type="month" placeholder="Pick a month" />
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
import data from "./data.json";

const formInline = reactive({
  user: "",
  region: "",
  date: ""
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
  { prop: "fSubname", label: "站点名称" },
  { prop: "fTransname", label: "变压器名称" },
  { prop: "transformername", label: "温度" }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  console.log("json", data.data);
  return new Promise(async resolve => {
    resolve({ list: [], total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
