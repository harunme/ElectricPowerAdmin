<template>
  <div class="Meter">
    <TransformerSelect />
    <div class="card content">
      <div class="action-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input placeholder="请输入仪表编号或名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="onSubmit">Excel</el-button>
          <el-button type="primary" @click="onSubmit">批量修改</el-button>
          <el-button type="primary" @click="onSubmit">新增仪表</el-button>
        </div>
      </div>
      <div class="table-box">
        <PaginationTable :columns="columns" :fetch-data="fetchData">
          <template #actions="{}">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="Meter">
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
  { prop: "stationname", label: "变配电站名称" },
  { prop: "stationid", label: "仪表编号" },
  { prop: "voltagestep", label: "仪表名称" },
  { prop: "voltagestep", label: "网关" },
  { prop: "voltagestep", label: "串口号" },
  { prop: "voltagestep", label: "仪表类型" },
  { prop: "voltagestep", label: "仪表地址" },
  { prop: "voltagestep", label: "仪表状态" },
  { prop: "voltagestep", label: "设备" },
  { prop: "voltagestep", label: "灭火器装置" },
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
