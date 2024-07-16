<template>
  <div class="SubGroup">
    <div class="card table-box">
      <el-form>
        <el-form-item>
          <el-button type="primary">新增区域</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable :columns="columns" :fetch-data="fetchData">
        <template #actions="">
          <el-button type="text" size="mini">修改</el-button>
          <el-button type="text" size="mini">删除</el-button>
        </template>
      </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="SubGroup">
// import { reactive } from "vue";
// import { ReqPage } from "@/api/interface";
// import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const columns = [
  { prop: "stationname", label: "分组名称" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    // const { data } = await EnergyReportNoHjPageInfo({
    //   pageNum,
    //   pageSize,
    //   startTime: "2024-06-01",
    //   endTime: "2024-06-23"
    // });
    // console.log("fetchData", data.list);
    resolve({ total: 0, list: [] });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
