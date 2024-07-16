<template>
  <div class="Gateway">
    <TransformerSelect />
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary">新增网关</el-button>
        </el-form-item>
        <el-form-item>
          <el-button>导出</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable :columns="columns" :fetch-data="fetchData">
          <template #actions="">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="Gateway">
// import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const columns: any = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "stationid", label: "网关名称" },
  { prop: "voltagestep", label: "网关代码" },
  { prop: "voltagestep", label: "网关型号" },
  { prop: "voltagestep", label: "网关状态" },
  { prop: "voltagestep", label: "IP" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
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
