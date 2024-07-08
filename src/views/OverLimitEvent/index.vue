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
        </el-form-item>
      </el-form>
      <PaginationTable :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyReportOfCollection">
import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { GetAlarmEventYcList } from "@/api/modules/main";
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
  { prop: "stationid", label: "开始时间" },
  { prop: "voltagestep", label: "报警类型" },
  { prop: "voltagestep", label: "仪表名称" },
  { prop: "voltagestep", label: "参数名称" },
  { prop: "voltagestep", label: "报警值" },
  { prop: "voltagestep", label: "限定值" },
  { prop: "voltagestep", label: "详情" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await GetAlarmEventYcList({
      pageNum,
      pageSize,
      starttime: "2024-06-01",
      endtime: "2024-06-23"
    });
    console.log("fetchData", data.list);
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
