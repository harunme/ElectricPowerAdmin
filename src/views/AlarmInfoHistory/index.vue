<template>
  <div class="AlarmInfoHistory">
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
        <el-form-item label="报警等级" prop="messinfolevel">
          <el-select v-model="formInline.messinfolevel">
            <el-option label="全部" value="0" />
            <el-option label="普通" value="1" />
            <el-option label="严重" value="2" />
            <el-option label="事故" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="报警类型分类" prop="messinfotype">
          <el-select v-model="formInline.messinfotype">
            <el-option label="全部" value="无" />
            <el-option label="通讯状态" value="2" />
            <el-option label="现场报警" value="3" />
            <el-option label="设备故障" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型">
          <el-input v-model="formInline.alarmtype" placeholder="请输入事件类型"></el-input>
        </el-form-item>
        <el-form-item label="设备名称或编号">
          <el-input v-model="formInline.metersearch" placeholder="请输入设备名称或编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData">
        <template #actions="{ row }">
          <el-button type="primary" size="mini" bg text @click="showAlarmDetail(row)">查看</el-button>
        </template>
      </PaginationTable>
      <el-dialog v-model="dialogDetailVisible" title="报警详情" width="760">
        <el-descriptions :column="2" :border="true" style="padding: 0 24px 24px">
          <el-descriptions-item label="变配电站名称"> {{ alarmDetail.stationname }} </el-descriptions-item>
          <el-descriptions-item label="设备名称"> {{ alarmDetail.metername }} </el-descriptions-item>
          <el-descriptions-item label="设备编号"> {{ alarmDetail.meter }} </el-descriptions-item>
          <el-descriptions-item label="报警类型"> {{ alarmDetail.messinfotypetext }} </el-descriptions-item>
          <el-descriptions-item label="发生时间"> {{ alarmDetail.alarttime }} </el-descriptions-item>
          <el-descriptions-item label="报警详情"> {{ alarmDetail.eventdescription }} </el-descriptions-item>
          <el-descriptions-item label="参数编号"> {{ alarmDetail.eventname0 }} </el-descriptions-item>
          <el-descriptions-item label="参数名称"> {{ alarmDetail.paramname }} </el-descriptions-item>
          <el-descriptions-item label="当前值"> {{ alarmDetail.value }} </el-descriptions-item>
          <el-descriptions-item label="设定值"> {{ alarmDetail.limitvalue }} </el-descriptions-item>
          <el-descriptions-item label="确认状态"> {{ alarmDetail.confirmstatus ? "已确认" : "未确认" }} </el-descriptions-item>
          <el-descriptions-item label="确认人"> {{ alarmDetail.confirmer }} </el-descriptions-item>
          <el-descriptions-item label="确认时间"> {{ alarmDetail.mconfirmtime }} </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmInfoHistory">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { GetAlarmEventLogListHis } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import { getContextStationId } from "@/utils";
import { exportExcel } from "@/utils/exportExcel";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
const dialogDetailVisible = ref(false);
const alarmDetail = ref<any>({});
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  messinfolevel: "0",
  metersearch: "",
  alarmtype: "",
  messinfotype: "无",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const showAlarmDetail = alarm => {
  dialogDetailVisible.value = true;
  alarmDetail.value = alarm;
};

const onExport = async () => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const messinfolevel = formInline.messinfolevel;
  const metersearch = formInline.metersearch;
  const alarmtype = formInline.alarmtype;
  const messinfotype = formInline.messinfotype;
  const params: any = {
    pageNum: 1,
    pageSize: 99999,
    starttime,
    endtime,
    metersearch,
    alarmtype,
    messinfotype
  };
  if (messinfolevel !== "0") {
    params.messinfolevel = messinfolevel;
  }
  if (getContextStationId()) params.stationid = getContextStationId();

  const textKeyMaps = [
    { 变配电站名称: "stationname" },
    { 设备名称: "metername" },
    { 报警类型分类: "alarmtype" },
    { 事件类型: "messinfotypetext" },
    { 发生时间: "alarmtime" },
    { 报警等级: "messinfoleveltext" },
    { 详情: "eventdescription" }
  ];

  const { data } = await GetAlarmEventLogListHis(params);

  exportExcel({
    data: data.list,
    textKeyMaps,
    filename: `${starttime}_${endtime}_报警历史信息.xlsx`
  });
};

const columns = [
  { prop: "stationname", label: "变配电站名称", width: 180 },
  { prop: "metername", label: "设备名称", width: 180 },
  { prop: "messinfotypetext", label: "报警类型分类", width: 120 },
  { prop: "alarmtype", label: "事件类型", width: 120 },
  { prop: "alarmtime", label: "发生时间", width: 200 },
  { prop: "messinfoleveltext", label: "报警等级", width: 80 },
  { prop: "eventdescription", label: "详情" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 120 }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const messinfolevel = formInline.messinfolevel;
  const metersearch = formInline.metersearch;
  const alarmtype = formInline.alarmtype;
  const messinfotype = formInline.messinfotype;
  const params: any = {
    pageNum,
    pageSize,
    starttime,
    endtime,
    metersearch,
    alarmtype,
    messinfotype
  };
  if (messinfolevel !== "0") {
    params.messinfolevel = messinfolevel;
  }
  if (getContextStationId()) params.stationid = getContextStationId();
  return new Promise(async resolve => {
    const { data } = await GetAlarmEventLogListHis(params);
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
