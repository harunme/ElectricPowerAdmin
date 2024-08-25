<template>
  <div class="ElectricData flex-column">
    <TransformerSelect :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card content-box">
        <el-tabs v-model="activeTab" @tab-click="tabClick">
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
                <el-option v-for="kind in energyKinds" :key="kind.value" :label="kind.name" :value="kind.value" />
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
              <PaginationTable ref="tableRef1" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
              </PaginationTable>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-if="activeTab === 1">
            <el-tab-pane label="图表" class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
            </el-tab-pane>
            <el-tab-pane label="数据" class="chart-box">
              <PaginationTable ref="tableRef2" :fetch-on-mounted="false" :columns="columns2" :fetch-data="fetchData">
              </PaginationTable>
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
import { ElectricDataMonth, ElectricDataPaging } from "@/api/modules/main";
import CollapseBox from "@/components/CollapseBox/index.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { ReqPage } from "@/api/interface/index";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { ElMessage } from "element-plus";
import { getContextStationId } from "@/utils";
import { columnsConfig, phaseConfig, energyKinds } from "./config";

const size = ref<"default" | "large" | "small">("default");
const formInline = reactive({
  range: ["2024-06-01", "2024-07-01"],
  energykind: "P",
  phase: ""
});
const tableRef1 = ref<any>(null);
const tableRef2 = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const option = ref<ECOption | null>(null);
const columns = ref<any>([]);
const activeTab = ref<0 | 1>(0);
const circuit = ref<any>(null);

const columns2 = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "日期" },
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
    const ElectricDataPagingParams: any = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      pageNum,
      pageSize,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      phase: phaseConfig[formInline.energykind],
      energykind: formInline.energykind
    };

    const ElectricDataMonthParams: any = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      energykind: formInline.energykind,
      phase: phaseConfig[formInline.energykind]
    };
    // http://111.231.24.91/main/ElecMaxMinAvgValue
    const { data: ElectricDataPagingData } = await ElectricDataPaging(ElectricDataPagingParams);
    const { data: ElectricDataMonthData } = await ElectricDataMonth(ElectricDataMonthParams);
    option.value = {
      title: {
        text: energyKinds.find(kind => kind.value === formInline.energykind).name
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: energyKinds.find(kind => kind.value === formInline.energykind).chartkeys
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
        data: ElectricDataMonthData?.times
      },
      yAxis: {
        type: "value"
      },
      series: energyKinds
        .find(kind => kind.value === formInline.energykind)
        .chartkeys.map(key => ({
          name: key,
          type: "line",
          stack: "Total",
          data: ElectricDataMonthData ? ElectricDataMonthData[key].map(Number) : []
        }))
    };
    resolve({ list: ElectricDataPagingData?.list, total: ElectricDataPagingData?.total });
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
  if (activeTab.value === 0) {
    tableRef1?.value?.resetData();
  }
  if (activeTab.value === 1) {
    tableRef2?.value?.resetData();
  }
};

const onContextStationChange = () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  if (circuitids.length === 0) return ElMessage.info({ message: "请至少选择一个回路" });
  circuit.value = circuitids.join("-");
  onSubmit();
};

const tabClick = () => {
  onSubmit();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
