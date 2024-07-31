<template>
  <div class="ElectricData flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card content-box">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="日原始数据" :name="0"> </el-tab-pane>
          <el-tab-pane label="逐日极值数据" lazy :name="1"> </el-tab-pane>
        </el-tabs>
        <div class="flex-column">
          <el-form :inline="true" :model="formInline" class="table-form-inline">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="formInline.range"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :shortcuts="shortcuts"
                :size="size"
              />
            </el-form-item>
            <el-form-item label="电力类别">
              <el-select v-model="formInline.energykind">
                <el-option label="有功功率" value="P" />
                <el-option label="电流" value="I" />
                <el-option label="相电压" value="U" />
                <el-option label="线电压" value="UL" />
                <el-option label="频率" value="Fr" />
                <el-option label="功率因数" value="PF" />
                <el-option label="无功功率" value="Q" />
                <el-option label="视在功率" value="S" />
                <el-option label="三相不平衡度" value="UnB" />
                <el-option label="负载率" value="LF" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>

          <el-tabs v-if="activeTab === 0">
            <el-tab-pane label="图表" class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
            </el-tab-pane>
            <el-tab-pane label="数据" class="chart-box">
              <PaginationTable :columns="columns" :fetch-data="fetchData"> </PaginationTable>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-if="activeTab === 1">
            <el-tab-pane label="图表" class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
            </el-tab-pane>
            <el-tab-pane label="数据" class="chart-box">
              <PaginationTable ref="tableRef" :columns="columns2" :fetch-data="fetchData"> </PaginationTable>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="ElectricData">
import { ref, reactive } from "vue";
import moment from "moment";
// import { getCircuitInfoTree } from "@/api/modules/sys";
import { ElectricDataMonth, ElectricDataPaging } from "@/api/modules/main";
import { ReqPage } from "@/api/interface/index";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { columnsConfig, phaseConfig } from "./config";

// const end = new Date();
// const start = new Date();
// start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const size = ref<"default" | "large" | "small">("default");
const formInline = reactive({
  range: ["2024-06-01", "2024-07-01"],
  energykind: "P",
  phase: ""
});
const tableRef = ref<any>(null);
const option = ref<ECOption | null>(null);
const columns = ref<any>([]);
const activeTab = ref<0 | 1>(0);

const columns2 = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "日期" },
  {
    label: "总有功功率(kW)",
    children: [
      {
        label: "最大值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      {
        label: "最小值",
        children: [
          { prop: "text", label: "数值" },
          { prop: "3sdf11", label: "发生时间" }
        ]
      },
      { prop: "3sdf", label: "平均值" }
    ]
  }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    columns.value = columnsConfig[formInline.energykind];
    // params.starttime = moment(formInline.daterange[0]).format("YYYY-MM-DD");
    // params.endtime = moment(formInline.daterange[1]).format("YYYY-MM-DD");
    const ElectricDataPagingParams: any = {
      stationid: "000",
      circuitids: "000",
      pageNum,
      pageSize,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      phase: phaseConfig[formInline.energykind],
      energykind: formInline.energykind
    };

    const { data: ElectricDataPagingData } = await ElectricDataPaging(ElectricDataPagingParams);
    const { data: ElectricDataMonthData } = await ElectricDataMonth({
      stationid: "000",
      circuitids: "000",
      starttime: "2024-06-01",
      endtime: "2024-06-30",
      energykind: "P",
      phase: "Pa-Pb-Pc-P"
    });
    option.value = {
      title: {
        text: "有功功率"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["P", "Pa", "Pb", "Pc"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none"
          },
          dataView: { readOnly: false },
          magicType: { type: ["line", "bar"] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ElectricDataMonthData.times
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "P",
          type: "line",
          stack: "Total",
          data: ElectricDataMonthData.P.map(Number)
        },
        {
          name: "Pa",
          type: "line",
          stack: "Total",
          data: ElectricDataMonthData.Pa.map(Number)
        },
        {
          name: "Pb",
          type: "line",
          stack: "Total",
          data: ElectricDataMonthData.Pb.map(Number)
        },
        {
          name: "Pc",
          type: "line",
          stack: "Total",
          data: ElectricDataMonthData.Pc.map(Number)
        }
      ]
    };
    resolve({ list: ElectricDataPagingData.list, total: ElectricDataPagingData.total });
  });
};

const shortcuts = [
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

const onSubmit = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
