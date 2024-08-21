<template>
  <div class="OverLimitEvent">
    <TransformerSelect :on-change="onContextStationChange" />
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
        <el-form-item label="事件类型" prop="eventtype">
          <el-select v-model="formInline.eventtype">
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
          <!-- <el-button @click="onExport">导出</el-button> -->
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="OverLimitEvent">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { GetAlarmEventYcList } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { getContextStationId } from "@/utils";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  eventtype: "全部",
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
  { prop: "stationname", label: "变配电站名称", width: 300 },
  { prop: "alarmtime", label: "开始时间", width: 200 },
  { prop: "voltagestep", label: "报警类型", width: 120 },
  { prop: "metername", label: "仪表名称", width: 180 },
  { prop: "paramname", label: "参数名称", width: 180 },
  { prop: "statefloat", label: "报警值", width: 180 },
  { prop: "limitvalue", label: "限定值", width: 180 },
  { prop: "eventdescription", label: "详情" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const eventtype = formInline.eventtype;
  const metername = formInline.metername;
  const paramname = formInline.paramname;

  const params: any = {
    pageNum,
    pageSize,
    starttime,
    endtime,
    metername,
    eventtype,
    paramname
  };
  if (getContextStationId()) params.stationid = getContextStationId();
  return new Promise(async resolve => {
    const { data } = await GetAlarmEventYcList(params);
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
