<template>
  <div class="MonitoringLoop">
    <TransformerSelect />
    <div class="card content">
      <div class="action-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input placeholder="请输入回路编号或名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSubmit">新建监测回路</el-button>
      </div>
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

<script setup lang="tsx" name="MonitoringLoop">
import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};

const columns: any = [
  { prop: "stationname", label: "回路名称" },
  { prop: "stationid", label: "回路编号" },
  { prop: "voltagestep", label: "上级回路" },
  { prop: "voltagestep", label: "是否进线" },
  { prop: "voltagestep", label: "仪表编号" },
  { prop: "voltagestep", label: "状态" },
  { prop: "actions", label: "操作", width: 132 }
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
