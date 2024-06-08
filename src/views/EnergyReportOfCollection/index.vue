<template>
  <div>
    <div class="card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="开始时间">
          <el-date-picker type="date" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker type="date" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onSubmit">导出</el-button>
          <span>（单位：kW·h）</span>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" height="200" :summary-method="getSummaries" show-summary style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="amount1" label="Cost 1 ($)" />
      <el-table-column prop="amount2" label="Cost 2 ($)" />
      <el-table-column prop="amount3" label="Cost 3 ($)" />
    </el-table>
  </div>
</template>

<script setup lang="ts" name="EnergyReportOfCollection">
import { reactive } from "vue";
import { h } from "vue";
import type { VNode } from "vue";
import type { TableColumnCtx } from "element-plus";

const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};

interface Product {
  id: string;
  name: string;
  amount1: string;
  amount2: string;
  amount3: number;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: (string | VNode)[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h("div", { style: { textDecoration: "underline" } }, ["Total Cost"]);
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}`;
    } else {
      sums[index] = "N/A";
    }
  });

  return sums;
};

const tableData: Product[] = [
  {
    id: "12987122",
    name: "Tom",
    amount1: "234",
    amount2: "3.2",
    amount3: 10
  },
  {
    id: "12987123",
    name: "Tom",
    amount1: "165",
    amount2: "4.43",
    amount3: 12
  },
  {
    id: "12987124",
    name: "Tom",
    amount1: "324",
    amount2: "1.9",
    amount3: 9
  },
  {
    id: "12987125",
    name: "Tom",
    amount1: "621",
    amount2: "2.2",
    amount3: 17
  },
  {
    id: "12987126",
    name: "Tom",
    amount1: "539",
    amount2: "4.1",
    amount3: 15
  }
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
