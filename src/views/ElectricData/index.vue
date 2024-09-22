<template>
  <div class="ElectricData flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
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
              <el-select v-model="formInline.energykind" @change="changeEnergykind">
                <el-option v-for="kind in energyKinds" :key="kind.value" :label="kind.name" :value="kind.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="formInline.phase">
                <el-checkbox
                  :key="key"
                  v-for="key in phaseConfig[formInline.energykind].split('-')"
                  :label="phaseMap[key]"
                  :value="key"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-tabs v-if="activeTab === 0">
            <el-tab-pane label="图表" class="chart-box">
              <el-popover v-if="option !== null" placement="right" :width="620" trigger="click">
                <template #reference>
                  <el-button class="button" type="primary" text @click="fetchMaxMinData">最值分析</el-button>
                </template>
                <PaginationTable :no-pagination="true" :columns="MaxMinColumns" :fetch-data="fetchMaxMinData"> </PaginationTable>
              </el-popover>
              <ECharts v-if="option !== null" :option="option" />
              <el-empty v-else description="暂无数据" />
            </el-tab-pane>
            <el-tab-pane label="数据" class="chart-box">
              <el-button type="primary" style="margin-bottom: 8px" @click="onExport">导出</el-button>
              <PaginationTable ref="tableRef1" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
              </PaginationTable>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-if="activeTab === 1">
            <el-tab-pane label="图表" class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
              <el-empty v-else description="暂无数据" />
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
import StationContext from "@/components/StationContext/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { ElMessage } from "element-plus";
import { getContextStationId } from "@/utils";
import { columnsConfig, phaseConfig, energyKinds, phaseMap } from "./config";
import { exportExcel } from "@/utils/exportExcel";

const size = ref<"default" | "large" | "small">("default");
const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  range: [moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD")],
  energykind: "P",
  phase: phaseConfig["P"].split("-")
});
const tableRef1 = ref<any>(null);
const tableRef2 = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const option = ref<any | null>(null);
const columns = ref<any>([]);
const activeTab = ref<0 | 1>(0);
const circuit = ref<any>(null);

const maxMinData = ref<any>([]);

const indexOfMaxMin = (arr, type) => {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (type === "max")
      if (Number(arr[i]) > max) {
        maxIndex = i;
        max = Number(arr[i]);
      }

    if (type === "min")
      if (Number(arr[i]) < max) {
        maxIndex = i;
        max = Number(arr[i]);
      }
  }
  return maxIndex;
};

const average = array => {
  if (array.length) return array.reduce((a, b) => a + b) / array.length;
  else return undefined;
};

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

const MaxMinColumns = [
  { prop: "param", label: "参数" },
  {
    label: "最大值",
    children: [
      { prop: "maxValue", label: "数值" },
      { prop: "maxTime", label: "发生时间", width: 110 }
    ]
  },
  {
    label: "最小值",
    children: [
      { prop: "minValue", label: "数值" },
      { prop: "maxTime", label: "发生时间", width: 110 }
    ]
  },
  { prop: "avgValue", label: "平均值" }
];

const fetchMaxMinData = async () => {
  return new Promise(async resolve => {
    resolve({ list: maxMinData.value });
  });
};

const changeEnergykind = value => {
  formInline.phase = phaseConfig[value].split("-");
};

const onExport = async () => {
  const params: any = {
    stationid: getContextStationId(),
    circuitids: circuit.value,
    pageNum: 1,
    pageSize: 99999,
    starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
    endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
    phase: formInline.phase.join("-"),
    energykind: formInline.energykind
  };
  const { data } = await ElectricDataPaging(params);
  const textKeyMaps = columns.value.map(({ label, prop }) => {
    return { [label]: prop };
  });
  exportExcel({
    data: data.list,
    textKeyMaps,
    filename: `${params.starttime}_${params.endtime}_电力数据.xlsx`
  });
};

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
      phase: formInline.phase.join("-"),
      energykind: formInline.energykind
    };

    const ElectricDataMonthParams: any = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      energykind: formInline.energykind,
      phase: formInline.phase.join("-")
    };

    const { data: ElectricDataPagingData } = await ElectricDataPaging(ElectricDataPagingParams);
    const { data: ElectricDataMonthData } = await ElectricDataMonth(ElectricDataMonthParams);

    maxMinData.value = formInline.phase.map(key => {
      const maxIndex = indexOfMaxMin(ElectricDataMonthData[key], "max");
      const minIndex = indexOfMaxMin(ElectricDataMonthData[key], "min");
      return {
        param: key,
        maxValue: ElectricDataMonthData[key][maxIndex],
        maxTime: ElectricDataMonthData["times"][maxIndex],
        avgValue: average(ElectricDataMonthData ? ElectricDataMonthData[key].map(Number) : []),
        minValue: ElectricDataMonthData[key][minIndex],
        minTime: ElectricDataMonthData["times"][minIndex]
      };
    });
    console.log("maxMinData", maxMinData.value);
    if (!ElectricDataPagingData) {
      resolve({ list: [], total: 0 });
    } else {
      resolve({ list: ElectricDataPagingData?.list, total: ElectricDataPagingData?.total });
    }
    if (!ElectricDataMonthData) {
      option.value = null;
    } else {
      option.value = {
        title: {
          textStyle: {
            color: "#1890ff"
          },
          x: "center",
          // textAlign: "center",
          text: `${ElectricDataMonthParams.starttime}-${ElectricDataMonthParams.endtime} ${energyKinds.find(kind => kind.value === formInline.energykind).name}`
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "3%",
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
    }
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
