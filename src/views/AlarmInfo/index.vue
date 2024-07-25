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
            <el-select v-model="formInline.scheme">
              <el-option label="全部" value="M" />
              <el-option label="未确认" value="Y" />
              <el-option label="已确认" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="range" />
          </el-form-item>
          <el-form-item label="报警类型分类">
            <el-select v-model="formInline.scheme">
              <el-option label="全部" value="M" />
              <el-option label="通讯状态" value="Y" />
              <el-option label="现场报警" value="Y" />
              <el-option label="设备故障" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="事件类型">
            <el-input />
          </el-form-item>
          <el-form-item label="设备名称或编号">
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="table-box">
          <el-tabs type="card" class="tabs">
            <el-tab-pane label="全部"> </el-tab-pane>
            <el-tab-pane label="普通"> </el-tab-pane>
            <el-tab-pane label="严重"> </el-tab-pane>
            <el-tab-pane label="事故"> </el-tab-pane>
          </el-tabs>
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmInfo">
import { ref, reactive, onMounted } from "vue";
import { ReqPage } from "@/api/interface/index";
import { summary, getUnConfirmedEventsByCache } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import { localGet } from "@/utils";
import ECharts from "@/components/Charts/echarts.vue";
import * as echarts from "echarts/core";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive<{
  scheme: "M" | "Y";
  starttime: any[];
}>({
  scheme: "M",
  starttime: [start, end]
});

// const number = ref({ red: 0, yellow: 0, green: 0 });
const tableRef = ref<any>(null);
const option = ref<any>(null);
const activeTab = ref<"all" | "unconfirm">("all");
const total = ref<number>(0);
const stationId = ref(localGet("context-transformer")?.stationid);
const pieOption = ref<any>(null);

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "transformername", label: "设备名称" },
  { prop: "voltagestep", label: "报警类型分类" },
  { prop: "regionname", label: "事件类型" },
  { prop: "pf", label: "发生时间" },
  { prop: "s", label: "报警描述" },
  { prop: "loadFactor", label: "报警等级" },
  { prop: "loadFactor", label: "确认状态" },
  { prop: "loadFactor", label: "详情" },
  { prop: "loadFactor", label: "操作" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await summary({
      pageNum,
      pageSize,
      stationid: stationId.value,
      sortParam: "station_id",
      sortTag: "ASC"
    });
    resolve(data.pageInfo);
  });
};

onMounted(() => {
  GetUnConfirmedEventsByCache();
});

const GetUnConfirmedEventsByCache = async () => {
  const { numsByType, numsByLevel } = await getUnConfirmedEventsByCache();
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
  // console.log(value);
  // activeTab.value=value;
  GetUnConfirmedEventsByCache();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
