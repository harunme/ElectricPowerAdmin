<template>
  <div class="QuadrantElectricity flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme">
              <el-option label="日报" value="D" />
              <el-option label="月报" value="M" />
              <el-option label="年报" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" :type="SchemeMap[formInline.scheme].type" />
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
            <el-button-group v-if="formInline.scheme === 'Y'">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一年
              </el-button>
              <el-button @click="clickNext">
                下一年<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <el-button-group v-if="formInline.scheme === 'D'">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
              </el-button>
              <el-button @click="clickNext">
                下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
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

<script setup lang="tsx" name="QuadrantElectricity">
import { ref, reactive } from "vue";
import { min, max } from "lodash";
import moment from "moment";
import { AveragePowerReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { getContextStationId } from "@/utils";
import { exportExcel } from "@/utils/exportExcel";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";

const SchemeMap = {
  D: {
    type: "day",
    format: "YYYY-MM-DD"
  },
  M: {
    type: "month",
    format: "YYYY-MM"
  },
  Y: {
    type: "year",
    format: "YYYY"
  }
};

const formInline = reactive<{
  scheme: "D" | "M" | "Y";
  starttime: string;
}>({
  scheme: "D",
  starttime: moment().format("YYYY-MM-DD")
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
  if (formInline.scheme === "Y") formInline.starttime = moment(formInline.starttime).subtract(1, "y").format("YYYY");
  if (formInline.scheme === "D") formInline.starttime = moment(formInline.starttime).subtract(1, "d").format("YYYY-MM-DD");
};

const clickNext = () => {
  if (formInline.scheme === "M") formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  if (formInline.scheme === "Y") formInline.starttime = moment(formInline.starttime).add(1, "y").format("YYYY");
  if (formInline.scheme === "D") formInline.starttime = moment(formInline.starttime).add(1, "d").format("YYYY-MM-DD");
};

const columns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "日期" },
  { prop: "fEpe", label: "正向有功电度" },
  { prop: "fEpi", label: "反向有功电度" },
  { prop: "fEqc", label: "正向无功电度" },
  { prop: "fEql", label: "反向无功电度" },
  { prop: "fPf", label: "平均功率因数" }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      scheme: formInline.scheme,
      starttime: moment(formInline.starttime).format(SchemeMap[formInline.scheme].format)
    };
    const { data } = await AveragePowerReport(params);
    if (!data) {
      resolve({ list: [] });
      option.value = null;
    } else {
      const list =
        data?.list.map(i => ({
          ...i,
          fPf: Number(i.fPF) / 1000
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
            min: min(list.map(({ fPF }) => fPF)),
            max: max(list.map(({ fPF }) => fPF))
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
            data: list.map(({ fPf }) => Number(fPf))
          }
        ]
      };
      resolve({ list });
    }
  });
};

const onExport = async () => {
  const typeString = {
    M: "月报",
    Y: "年报"
  };
  const params = {
    stationid: getContextStationId(),
    circuitids: circuit.value,
    scheme: formInline.scheme,
    starttime: formInline.starttime
  };
  const textKeyMaps = columns.map(({ label, prop }) => {
    return { [label]: prop };
  });

  const { data } = await AveragePowerReport(params);

  const list =
    data?.list.map(i => ({
      ...i,
      fPf: Number(i.fPF) / 1000
    })) || [];

  exportExcel({
    data: list,
    textKeyMaps,
    filename: `${formInline.starttime}_四象限电能${typeString[formInline.scheme]}.xlsx`
  });
};

const onContextStationChange = () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  circuit.value = circuitids.join("-");
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
