<template>
  <div class="Transformer">
    <TransformerSelect />
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary">新增变压器</el-button>
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

<script setup lang="tsx" name="Transformer">
// import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const columns: any = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "stationid", label: "变压器编号" },
  { prop: "voltagestep", label: "变压器名称" },
  { prop: "voltagestep", label: "变压器类型" },
  { prop: "voltagestep", label: "额定容量(kVA)" },
  { prop: "voltagestep", label: "额定电流(A)" },
  { prop: "voltagestep", label: "关联仪表" },
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
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
