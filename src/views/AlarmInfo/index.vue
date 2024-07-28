<template>
  <div class="flex-column AlarmInfo">
    <div class="main-box">
      <div class="card left-box">
        <el-tabs type="card" class="tabs" v-model="activeTab" @tab-change="tabChange" stretch>
          <el-tab-pane label="全部报警" name="all"> </el-tab-pane>
          <el-tab-pane label="未处理报警" name="unconfirm"> </el-tab-pane>
        </el-tabs>
        <div class="all-alarms">
          <span>共计报警{{ total }}条</span>
          <div>
            <span>报警类型分析</span>
            <div>
              <ECharts v-if="option !== null" :option="option" />
            </div>
          </div>
          <div>
            <span>报警等级分析</span>
            <div>
              <ECharts v-if="pieOption !== null" :option="pieOption" />
            </div>
          </div>
        </div>
      </div>
      <div class="card flex-column right-box">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="确认状态">
            <el-select v-model="formInline.confirmstatus">
              <el-option label="全部" value="all" />
              <el-option label="未确认" value="Y" />
              <el-option label="已确认" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.range" type="range" />
          </el-form-item>
          <el-form-item label="报警类型分类">
            <el-select v-model="formInline.messinfotype">
              <el-option label="全部" value="all" />
              <el-option label="工作通知" value="1" />
              <el-option label="通讯状态" value="2" />
              <el-option label="现场报警" value="3" />
              <el-option label="设备故障" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item v-model="formInline.alarmtype" label="事件类型">
            <el-input />
          </el-form-item>
          <el-form-item label="设备名称或编号">
            <el-input v-model="formInline.metersearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <el-tabs type="card" class="tabs" @tab-change="alarmTypeTabChange">
          <el-tab-pane label="全部"> </el-tab-pane>
          <el-tab-pane label="普通"> </el-tab-pane>
          <el-tab-pane label="严重"> </el-tab-pane>
          <el-tab-pane label="事故"> </el-tab-pane>
        </el-tabs>
        <div class="table-box">
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData">
            <template #alarmtime="{ row }">
              {{ moment(row.alarmtime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
            <template #messinfoleveltext="{ row }">
              <span :class="`messinfoleveltext messinfoleveltext-${row.messinfolevel}`">{{ row.messinfoleveltext }}</span>
            </template>
            <template #confirmstatus="{ row }">
              <span :class="`confirmstatus-${row.confirmstatus}`">{{ row.confirmstatus ? "已确认" : "未确认" }}</span>
            </template>
            <template #actions="">
              <el-button type="text" size="mini">标记为已确认</el-button>
              <el-button type="text" size="mini">查看详情</el-button>
            </template>
          </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmInfo">
import { ref, reactive, onMounted } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface/index";
import { getAlarmEventLogList, getUnConfirmedEventsByCache } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import * as echarts from "echarts/core";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive<{
  messinfolevel?: "0" | "1" | "2" | "3";
  range: any[];
  metersearch?: string;
  alarmtype?: string;
  messinfotype?: "1" | "2" | "3" | "4" | "all";
  confirmstatus?: 0 | 1 | "all";
}>({
  range: [start, end],
  confirmstatus: "all",
  messinfotype: "all"
});

const tableRef = ref<any>(null);
const option = ref<any>(null);
const activeTab = ref<"all" | "unconfirm">("all");
const total = ref<number>(0);
const pieOption = ref<any>(null);

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "metername", label: "设备名称" },
  { prop: "messinfotypetext", label: "报警类型分类", width: 124 },
  { prop: "alarmtype", label: "事件类型", width: 124 },
  { prop: "customDom", slotName: "alarmtime", label: "发生时间", width: 184 },
  { prop: "eventdescription", label: "报警描述" },
  { prop: "customDom", slotName: "messinfoleveltext", label: "报警等级", width: 94 },
  { prop: "customDom", slotName: "confirmstatus", label: "确认状态", width: 84 },
  { prop: "customDom", slotName: "actions", label: "操作", width: 184 }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      pageNum,
      pageSize,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD")
    };
    if (formInline.confirmstatus !== "all") {
      params.confirmstatus = formInline.confirmstatus;
    }
    if (formInline.messinfotype !== "all") {
      params.messinfotype = formInline.messinfotype;
    }
    if (formInline.messinfolevel !== "0") {
      params.messinfolevel = formInline.messinfolevel;
    }

    const { data } = await getAlarmEventLogList(params);
    resolve({ list: data.list, total: data.total });
  });
};

onMounted(() => {
  GetUnConfirmedEventsByCache();
});

const GetUnConfirmedEventsByCache = async () => {
  const { numsByType, numsByLevel }: any = await getUnConfirmedEventsByCache();
  if (activeTab.value === "all")
    total.value = numsByType.reduce(function (acc, obj) {
      return acc + obj.eventcount;
    }, 0);
  else
    total.value = numsByType.reduce(function (acc, obj) {
      return acc + obj.unconfirmcount;
    }, 0);

  pieOption.value = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: "0%",
      left: "20%",

      align: "left",
      textStyle: {
        fontSize: 12,
        color: "#a1a1a1",
        fontWeight: 400
      }
    },
    series: [
      {
        type: "pie",
        radius: "40%",
        silent: true,
        clockwise: true,
        data: numsByLevel.map(({ eventname, eventcount, unconfirmcount }) => ({
          value: activeTab.value === "all" ? eventcount : unconfirmcount,
          name: eventname
        })),

        label: {
          position: "outer",
          show: true,
          fontSize: 12,
          alignTo: "labelLine",
          bleedMargin: 0
        }
      }
    ]
  };
  option.value = {
    radar: {
      radius: 80,
      indicator: numsByType.map(({ eventname }) => ({ name: eventname }))
    },
    series: [
      {
        type: "radar",
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
            {
              color: "rgba(255, 145, 124, 0.1)",
              offset: 0
            },
            {
              color: "rgba(255, 145, 124, 0.9)",
              offset: 1
            }
          ])
        },
        data: [
          {
            value: numsByType.map(({ eventcount, unconfirmcount }) => (activeTab.value === "all" ? eventcount : unconfirmcount)),
            lineStyle: {
              type: "dashed",
              color: "#1677ff"
            },
            symbol: "rect"
          }
        ]
      }
    ]
  };
};

const tabChange = () => {
  GetUnConfirmedEventsByCache();
};

const alarmTypeTabChange = value => {
  formInline.messinfolevel = value;
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
