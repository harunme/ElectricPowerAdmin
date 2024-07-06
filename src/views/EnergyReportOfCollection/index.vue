<template>
  <div class="EnergyReportOfCollection">
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
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
      <PaginationTable :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyReportOfCollection">
import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "stationid", label: "变配电站编号" },
  { prop: "voltagestep", label: "合计" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await EnergyReportNoHjPageInfo({
      pageNum,
      pageSize,
      startTime: "2024-06-01",
      endTime: "2024-06-23"
    });
    console.log("fetchData", data.list);
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
