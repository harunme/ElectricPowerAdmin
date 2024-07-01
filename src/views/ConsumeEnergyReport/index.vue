<template>
  <div class="flex-column ConsumeEnergyReport">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="formInline.date"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="电能类别">
            <el-select v-model="formInline.type">
              <el-option label="正向有功总电能" value="shanghai" />
              <el-option label="反向有功总电能" value="beijing" />
              <el-option label="组合有功电能" value="beijing" />
            </el-select>
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
  { prop: "fSubname", label: "回路名称 / kW·h" },
  { prop: "fTransname", label: "起始数值" },
  { prop: "transformername", label: "截止数值" },
  { prop: "transformername", label: "差值" },
  { prop: "transformername", label: "差值费用" }
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
