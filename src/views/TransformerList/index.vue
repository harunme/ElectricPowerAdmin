<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card chart-box">
        <CirecleNumber label="高损耗运行" />
        <CirecleNumber label="正常运行" color="#e7a900" />
        <CirecleNumber label="经济运行" color="#12bb5d" />
        <div class="pie-box">
          <Pie :data="pieData" />
        </div>
      </div>
      <div class="card table-box">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="变配电站名称" />
          <el-table-column prop="date" label="变压器" />
          <el-table-column prop="date" label="额定容量(kVA)" width="150" />
          <el-table-column prop="date" label="有功功率(kW)" width="150" />
          <el-table-column prop="date" label="功率因数" width="150" />
          <el-table-column prop="date" label="视在功率(kVA)" width="150" />
          <el-table-column prop="date" label="负载率" width="150" />
          <el-table-column label="温度(℃)">
            <el-table-column prop="name" label="A" width="120" />
            <el-table-column prop="state" label="B" width="120" />
            <el-table-column prop="city" label="C" width="120" />
            <el-table-column prop="address" label="油浸" width="120" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CirecleNumber from "@/components/Charts/components/CirecleNumber.vue";
import Pie from "@/components/Charts/components/Pie.vue";

const pieData = [
  {
    value: 6,
    name: "高损耗运行",
    itemStyle: {
      color: "#ff4949"
    }
  },
  {
    value: 4,
    name: "正常运行",
    itemStyle: {
      color: "#e7a900"
    }
  },
  {
    value: 2,
    name: "经济运行",
    itemStyle: {
      color: "#12bb5d"
    }
  }
];

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  }
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
