<template>
  <div class="SignalEvent">
    <StationContext :on-change="onContextStationChange" />
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="开始时间" prop="date">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="仪表名称">
          <el-input v-model="formInline.metername" placeholder="请输入仪表名称"></el-input>
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input v-model="formInline.paramname" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <!-- <el-button @click="onExport">导出</el-button> -->
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="SignalEvent">
import { ref, reactive } from "vue";
import moment from "moment";
import StationContext from "@/components/StationContext/index.vue";
import { ReqPage } from "@/api/interface";
import { EnergyLineLoss } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import { getContextStationId } from "@/utils";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  metername: "",
  paramname: "",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

// const onExport = () => {
//   console.log("onExport");
// };

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "alarmtime", label: "开始时间" },
  { prop: "meter", label: "仪表编号" },
  { prop: "metername", label: "仪表名称" },
  { prop: "eventname0", label: "参数编号" },
  { prop: "paramname", label: "参数名称" },
  { prop: "codetype", label: "报警类型" },
  { prop: "alarmtype", label: "类型" },
  { prop: "eventdescription", label: "详情" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const metername = formInline.metername;
  const paramname = formInline.paramname;

  return new Promise(async resolve => {
    const params: any = {
      pageNum,
      pageSize,
      starttime,
      endtime,
      paramname,
      metername
    };
    if (getContextStationId()) params.stationid = getContextStationId();
    const { data } = await EnergyLineLoss(params);
    resolve(data);
  });
};

const onContextStationChange = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
