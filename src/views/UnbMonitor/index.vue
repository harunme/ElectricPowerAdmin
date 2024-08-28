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
                  <el-empty v-else description="暂无数据" />
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
                  <ECharts v-if="optionElecMaxMinAvgValue !== null" :option="optionElecMaxMinAvgValue" />
                  <el-empty v-else description="暂无数据" />
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
import moment from "moment";
import { ElectricData, ElecMaxMinAvgValue } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { getContextStationId } from "@/utils";

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
const columnsElecMaxMinAvgValue = ref<any>([]);

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
      circuitids: circuit.value.circuitid,
      startTime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endTime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      phase: formInline.phase
    });
    if (!data?.PowerValue || data?.PowerValue.length === 0) return resolve({ list: [] });
    else {
      optionElectricData.value = {
        title: {
          text: `${moment(formInline.range[0]).format("YYYY-MM-DD")}-${moment(formInline.range[1]).format("YYYY-MM-DD")} ${circuit.value.circuitname} ${PhaseMap[formInline.phase]}`,
          left: "center",
          textStyle: {
            color: "rgb(31,125,195)",
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [formInline.phase],
          left: "center",
          top: "4%"
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
          data: data?.PowerValue.map(({ date }: any) => date)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: formInline.phase,
            type: "line",
            stack: "Total",
            data: data?.PowerValue.map(({ data }: any) => data)
          }
        ]
      };
      resolve({ list: data?.PowerValue });
    }
  });
};

const fetchElecMaxMinAvgValue = async (): Promise<any> => {
  return new Promise(async resolve => {
    if (formInline.phase === "IUnB") {
      columnsElecMaxMinAvgValue.value = [
        { prop: "objectname", label: "回路名称" },
        { prop: "savetime", label: "日期" },
        {
          label: "三相电流不平衡度(%)",
          children: [
            {
              label: "最大值",
              children: [
                { prop: "fIUnBmaxvalue", label: "数值" },
                { prop: "fIUnBmaxtime", label: "发生时间" }
              ]
            },
            {
              label: "最小值",
              children: [
                { prop: "fIUnBminvalue", label: "数值" },
                { prop: "fIUnBmintime", label: "发生时间" }
              ]
            },
            { prop: "fIUnBavgvalue", label: "平均值" }
          ]
        }
      ];
    }
    if (formInline.phase === "UUnB") {
      columnsElecMaxMinAvgValue.value = [
        { prop: "objectname", label: "回路名称" },
        { prop: "savetime", label: "日期" },
        {
          label: "三相电压不平衡度(%)",
          children: [
            {
              label: "最大值",
              children: [
                { prop: "fUUnBmaxvalue", label: "数值" },
                { prop: "fUUnBmaxtime", label: "发生时间" }
              ]
            },
            {
              label: "最小值",
              children: [
                { prop: "fUUnBminvalue", label: "数值" },
                { prop: "fUUnBmintime", label: "发生时间" }
              ]
            },
            { prop: "fUUnBavgvalue", label: "平均值" }
          ]
        }
      ];
    }
    const { data } = await ElecMaxMinAvgValue({
      stationid: getContextStationId(),
      circuitids: circuit.value.circuitid,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      param: "UnB",
      scheme: "day"
    });
    if (!data?.StatisticValue) return resolve({ list: [] });
    else {
      optionElecMaxMinAvgValue.value = {
        title: {
          text: `${moment(formInline.range[0]).format("YYYY-MM-DD")}-${moment(formInline.range[1]).format("YYYY-MM-DD")} ${circuit.value.circuitname} ${PhaseMap[formInline.phase]}`,
          left: "center",
          textStyle: {
            color: "rgb(31,125,195)",
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["最大值", "最小值", "平均值"],
          left: "center",
          top: "4%"
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
          data: data?.StatisticValue.map(({ savetime }: any) => savetime)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "最大值",
            type: "line",
            stack: "Total",
            data: data?.StatisticValue.map(({ fIUnBmaxvalue, fUUnBmaxvalue }: any) =>
              formInline.phase === "IUnB" ? fIUnBmaxvalue : fUUnBmaxvalue
            )
          },
          {
            name: "最小值",
            type: "line",
            stack: "Total",
            data: data?.StatisticValue.map(({ fIUnBminvalue, fUUnBminvalue }: any) =>
              formInline.phase === "IUnB" ? fIUnBminvalue : fUUnBminvalue
            )
          },
          {
            name: "平均值",
            type: "line",
            stack: "Total",
            data: data?.StatisticValue.map(({ fIUnBavgvalue, fUUnBavgvalue }: any) =>
              formInline.phase === "IUnB" ? fIUnBavgvalue : fUUnBavgvalue
            )
          }
        ]
      };
      resolve({ list: data?.StatisticValue });
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

const onCircuitInfoTreeChange = (circuitids: string[], circuitinfo: any[]) => {
  console.log("circuitids", circuitids);
  circuit.value = circuitinfo[0];
  tableRef?.value?.resetData();
  tableElecMaxMinAvgValueRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
