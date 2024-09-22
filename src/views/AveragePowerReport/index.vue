<template>
  <div class="AveragePowerReport flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme">
              <el-option label="月报" value="M" />
              <el-option label="年报" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="formInline.starttime"
              :type="formInline.scheme === 'M' ? 'month' : 'year'"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item>
            <el-button-group v-if="formInline.scheme === 'M'">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button @click="clickNext">
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <el-button-group v-else>
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一年
              </el-button>
              <el-button @click="clickNext">
                下一年<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onExport">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="chart-box">
          <ECharts v-if="option !== null" :option="option" />
          <el-empty v-else description="暂无数据" />
        </div>
        <PaginationTable
          show-summary
          :summary-method="getSummaries"
          ref="tableRef"
          :fetch-on-mounted="false"
          :span-method="objectSpanMethod"
          :columns="columns"
          :fetch-data="fetchData"
        >
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AveragePowerReport">
import { ref, reactive, h } from "vue";
import { min, max } from "lodash";
import moment from "moment";
import { AveragePowerReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { getContextStationId } from "@/utils";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { exportExcel } from "@/utils/exportExcel";

const formInline = reactive<{
  scheme: "M" | "Y";
  starttime: string;
}>({
  scheme: "M",
  starttime: moment().format("YYYY-MM")
});

const tableRef = ref<any>(null);
const option = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const clickPrev = () => {
  if (formInline.scheme === "M") formInline.starttime = moment(formInline.starttime).subtract(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).subtract(1, "y").format("YYYY");
};

const clickNext = () => {
  if (formInline.scheme === "M") formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  if (formInline.scheme === "Y") formInline.starttime = moment(formInline.starttime).add(1, "y").format("YYYY");
};

const columns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "日期" },
  { prop: "fEpe", label: "正向有功电度" },
  { prop: "fEpi", label: "反向有功电度" },
  { prop: "fEqc", label: "正向无功电度" },
  { prop: "fEql", label: "反向无功电度" },
  { prop: "fPF", label: "平均功率因数" }
];

const getSummaries = (param: any) => {
  const { columns, data } = param;
  const sums: any[] = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h("div", { style: { fontWeight: "bolder" } }, ["合计"]);
      return;
    }
    if (index === 1) {
      sums[index] = h("div", { style: {} }, ["-"]);
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    sums[index] = `${values.reduce((prev, curr) => {
      const value = Number(curr);
      if (!Number.isNaN(value)) {
        return prev + curr;
      } else {
        return prev;
      }
    }, 0)}`;
  });

  return sums;
};

const onExport = async () => {
  const params = {
    stationid: getContextStationId(),
    circuitids: circuit.value,
    scheme: formInline.scheme,
    starttime: moment(formInline.starttime).format(formInline.scheme === "M" ? "YYYY-MM" : "YYYY")
  };
  const { data }: any = await AveragePowerReport(params);
  const list =
    data?.list.map(i => ({
      ...i,
      fEpe: i.fEpe || 0,
      fEpi: i.fEpi || 0,
      fEqc: i.fEqc || 0,
      fEql: i.fEql || 0,
      fPF: i.fPF ? Number(i.fPF) / 1000 : 0
    })) || [];

  const textKeyMaps = columns.map(({ label, prop }) => {
    return { [label]: prop };
  });

  exportExcel({
    data: list,
    textKeyMaps,
    filename: `${moment(formInline.starttime).format(formInline.scheme === "M" ? "YYYY-MM" : "YYYY")}_平均功率因数${formInline.scheme === "M" ? "月报" : "年报"}.xlsx`
  });
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      scheme: formInline.scheme,
      starttime: moment(formInline.starttime).format(formInline.scheme === "M" ? "YYYY-MM" : "YYYY")
    };
    const { data } = await AveragePowerReport(params);
    if (!data) {
      resolve({ list: [] });
      option.value = null;
    } else {
      const list =
        data?.list.map(i => ({
          ...i,
          fEpe: i.fEpe || 0,
          fEpi: i.fEpi || 0,
          fEqc: i.fEqc || 0,
          fEql: i.fEql || 0,
          fPF: i.fPF ? Number(i.fPF) / 1000 : 0
        })) || [];
      option.value = {
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 64,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["正向有功电度", "反向有功电度", "正向无功电度", "反向无功电度", "功率因数"]
        },
        xAxis: [
          {
            type: "category",
            data: list.map(({ collecttime }) => collecttime),
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "有功电度/无功电度"
          },
          {
            type: "value",
            name: "功率因数",
            min: min(list.map(({ fPF }) => fPF || 0)),
            max: max(list.map(({ fPF }) => fPF || 0))
          }
        ],
        series: [
          {
            name: "正向有功电度",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " ml";
              }
            },
            data: list.map(({ fEpe }) => Number(fEpe))
          },
          {
            name: "反向有功电度",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " ml";
              }
            },
            data: list.map(({ fEpi }) => Number(fEpi))
          },
          {
            name: "正向无功电度",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " ml";
              }
            },
            data: list.map(({ fEqc }) => Number(fEqc))
          },
          {
            name: "反向无功电度",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " ml";
              }
            },
            data: list.map(({ fEql }) => Number(fEql))
          },
          {
            name: "功率因数",
            type: "line",
            yAxisIndex: 1,
            smooth: 0.6,
            lineStyle: {
              color: "#ffba00",
              width: 3
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + " °C";
              }
            },
            data: list.map(({ fPF }) => (fPF ? Number(fPF) : 0))
          }
        ]
      };
      resolve({ list });
    }
  });
};

const onContextStationChange = () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  circuit.value = circuitids.join("-");
  tableRef?.value?.resetData();
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
