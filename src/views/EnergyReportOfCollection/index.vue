<template>
  <div class="EnergyReportOfCollection">
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="formInline.range"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <!-- <el-button @click="onSubmit">导出</el-button> -->
          <span>（单位：kW·h）</span>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyReportOfCollection">
import { reactive, ref } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tableRef = ref<any>(null);

const formInline = reactive({
  range: [moment().startOf("month").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
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
      startTime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endTime: moment(formInline.range[1]).format("YYYY-MM-DD")
    });
    resolve({ list: data?.list || [] });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
