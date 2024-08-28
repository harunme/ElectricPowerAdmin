<template>
  <div class="UnbMonitor flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card content-box">
        <el-tabs>
          <el-tab-pane label="日原始数据" class="content-pane">
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
                  <el-select v-model="formInline.phase">
                    <el-option label="三相电流不平衡度" value="IUnB" />
                    <el-option label="三相电压不平衡度" value="UUnB" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
              <el-tabs>
                <el-tab-pane label="图表" class="chart-box">
                  <ECharts v-if="optionElectricData !== null" :option="optionElectricData" />
                </el-tab-pane>
                <el-tab-pane label="数据" class="chart-box">
                  <PaginationTable
                    ref="tableRef"
                    :fetch-on-mounted="false"
                    :columns="columnsElectricData"
                    :fetch-data="fetchElectricData"
                  >
                  </PaginationTable>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-tab-pane>
          <el-tab-pane label="逐日极值数据" class="content-pane" lazy>
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
                  <el-select v-model="formInline.phase">
                    <el-option label="三相电流不平衡度" value="IUnB" />
                    <el-option label="三相电压不平衡度" value="UUnB" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onElecMaxMinAvgValueReload">查询</el-button>
                </el-form-item>
              </el-form>
              <el-tabs>
                <el-tab-pane label="图表" class="chart-box">
                  <ECharts :option="optionElecMaxMinAvgValue" />
                </el-tab-pane>
                <el-tab-pane label="数据" class="chart-box">
                  <PaginationTable
                    ref="tableElecMaxMinAvgValueRef"
                    :columns="columnsElecMaxMinAvgValue"
                    :fetch-data="fetchElecMaxMinAvgValue"
                  >
                  </PaginationTable>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="UnbMonitor">
import { ref, reactive } from "vue";
// import { ReqPage } from "@/api/interface/index";
import moment from "moment";
import { ElectricData, ElecMaxMinAvgValue } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
// import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { getContextStationId } from "@/utils";
// http://111.231.24.91/main/ElecMaxMinAvgValue
const size = ref<"default" | "large" | "small">("default");
const tableRef = ref<any>(null);
const tableElecMaxMinAvgValueRef = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

const formInline = reactive({
  range: [moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD")],
  phase: "IUnB" as any
});
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

const PhaseMap = {
  IUnB: "三相电流不平衡度",
  UUnB: "三相电压不平衡度"
};

const optionElectricData = ref<any>(null);
const optionElecMaxMinAvgValue = ref<any>(null);
const columnsElectricData = ref<any>([]);
const columnsElecMaxMinAvgValue = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "日期" },
  {
    label: "三相电流不平衡度(%)",
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

const fetchElectricData = async (): Promise<any> => {
  return new Promise(async resolve => {
    if (formInline.phase === "IUnB") {
      columnsElectricData.value = [
        { prop: "circuitname", label: "回路名称" },
        { prop: "date", label: "采集时间" },
        { prop: "data", label: "IUnB(%)" }
      ];
    }
    if (formInline.phase === "UUnB") {
      columnsElectricData.value = [
        { prop: "circuitname", label: "回路名称" },
        { prop: "date", label: "采集时间" },
        { prop: "data", label: "UUnB(%)" }
      ];
    }
    const { data } = await ElectricData({
      stationid: getContextStationId(),
      circuitids: circuit.value,
      startTime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endTime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      phase: formInline.phase
    });
    if (!data.PowerValue) return resolve({ list: [] });
    else {
      optionElectricData.value = {
        title: {
          text: PhaseMap[formInline.phase]
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"]
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
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      resolve({ list: data?.PowerValue });
    }
  });
};

const fetchElecMaxMinAvgValue = async (): Promise<any> => {
  return new Promise(async resolve => {
    // if (formInline.phase === "IUnB") {
    //   columnsElectricData.value = [
    //     { prop: "circuitname", label: "回路名称" },
    //     { prop: "date", label: "采集时间" },
    //     { prop: "data", label: "IUnB(%)" }
    //   ];
    // }
    // if (formInline.phase === "UUnB") {
    //   columnsElectricData.value = [
    //     { prop: "circuitname", label: "回路名称" },
    //     { prop: "date", label: "采集时间" },
    //     { prop: "data", label: "UUnB(%)" }
    //   ];
    // }
    const { data } = await ElecMaxMinAvgValue({
      stationid: getContextStationId(),
      circuitids: circuit.value,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      param: "UnB",
      scheme: "day"
    });
    if (!data.PowerValue) return resolve({ list: [] });
    else {
      optionElecMaxMinAvgValue.value = {
        title: {
          text: PhaseMap[formInline.phase]
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"]
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
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      resolve({ list: data?.PowerValue });
    }
  });
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onElecMaxMinAvgValueReload = () => {
  tableElecMaxMinAvgValueRef?.value?.resetData();
};

const onContextStationChange = async () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  circuit.value = circuitids[0];
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
