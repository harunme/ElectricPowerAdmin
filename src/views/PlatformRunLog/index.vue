<template>
  <div class="PlatformRunLog">
    <TransformerSelect />
    <div class="card flex-column table-box">
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
            <el-option label="网关离线" value="网关离线" />
            <el-option label="仪表离线" value="仪表离线" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="formInline.meterid" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="PlatformRunLog">
import { reactive, ref } from "vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ReqPage } from "@/api/interface";
import { PlatformRunLogPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import moment from "moment";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive({
  meterid: "",
  eventtype: "全部",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onExport = () => {
  console.log("onExport");
};

const columns = [
  { prop: "stationname", label: "变配电站名称", width: 300 },
  { prop: "stationid", label: "报警类型", width: 200 },
  { prop: "alarmtime", label: "时间", width: 200 },
  { prop: "meter", label: "设备编号", width: 200 },
  { prop: "metername", label: "设备名称", width: 200 },
  { prop: "eventdescription", label: "详情" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const eventtype = formInline.eventtype;
  const meterid = formInline.meterid;
  return new Promise(async resolve => {
    const { data } = await PlatformRunLogPageInfo({
      pageNum,
      pageSize,
      starttime,
      endtime,
      eventtype,
      meterid
    });
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
