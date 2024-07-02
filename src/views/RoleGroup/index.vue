<template>
  <div class="RoleGroup">
    <div class="card table-box">
      <el-form :inline="true">
        <el-form-item label="关键字">
          <el-input placeholder="请输入组织机构名称" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary">新增组织机构</el-button>
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

<script setup lang="tsx" name="RoleGroup">
// import { reactive } from "vue";
// import { ReqPage } from "@/api/interface";
// import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const columns = [
  { prop: "stationname", label: "组织机构名称" },
  { prop: "stationname", label: "信用编码" },
  { prop: "stationname", label: "地址" },
  { prop: "stationname", label: "负责人" },
  { prop: "actions", label: "操作" }
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
