<template>
  <div class="OverLimitEvent">
    <StationContext :on-change="onContextStationChange" />
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline" class="table-form-inline">
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
        <el-form-item label="事件类型" prop="statedes">
          <el-select v-model="formInline.statedes">
            <el-option label="全部" value="全部" />
            <el-option label="高限报警" value="高限报警" />
            <el-option label="高高限报警" value="高高限报警" />
            <el-option label="低限报警" value="低限报警" />
            <el-option label="低低限报警" value="低低限报警" />
            <el-option label="报警恢复" value="报警恢复" />
          </el-select>
        </el-form-item>
        <el-form-item label="仪表名称">
          <el-input v-model="formInline.metername" placeholder="请输入仪表名称"></el-input>
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input v-model="formInline.paramname" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
        <template #alarmtime="{ row }">
          <span>{{ moment(row.alarmtime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="OverLimitEvent">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { OverLimitEvent } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import { getContextStationId } from "@/utils";
import { exportExcel } from "@/utils/exportExcel";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  statedes: "全部",
  metername: "",
  paramname: "",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const columns = [
  { prop: "stationname", label: "变配电站名称", width: 200 },
  { prop: "customDom", slotName: "alarmtime", label: "开始时间", width: 132 },
  { prop: "alarmtype", label: "报警类型", width: 100 },
  { prop: "metername", label: "仪表名称", width: 142 },
  { prop: "paramname", label: "参数名称", width: 120 },
  { prop: "statefloat", label: "报警值", width: 80 },
  { prop: "limitvalue", label: "限定值", width: 80 },
  { prop: "eventdescription", label: "详情" }
];

const onExport = async () => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const statedes = formInline.statedes;
  const metername = formInline.metername;
  const paramname = formInline.paramname;

  const params: any = {
    pageNum: 1,
    pageSize: 99999,
    starttime,
    endtime,
    metername,
    statedes,
    paramname
  };
  if (getContextStationId()) params.stationid = getContextStationId();

  const textKeyMaps = [
    { 变配电站名称: "stationname" },
    { 开始时间: "alarmtime" },
    { 报警类型: "alarmtype" },
    { 仪表名称: "metername" },
    { 参数名称: "paramname" },
    { 报警值: "statefloat" },
    { 限定值: "limitvalue" },
    { 详情: "eventdescription" }
  ];

  const { data } = await OverLimitEvent(params);

  exportExcel({
    data: data.list,
    textKeyMaps,
    filename: `${starttime}_${endtime}_越限事件.xlsx`
  });
};

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const statedes = formInline.statedes;
  const metername = formInline.metername;
  const paramname = formInline.paramname;

  const params: any = {
    pageNum,
    pageSize,
    starttime,
    endtime,
    metername,
    statedes,
    paramname
  };
  if (getContextStationId()) params.stationid = getContextStationId();
  return new Promise(async resolve => {
    const { data } = await OverLimitEvent(params);
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
