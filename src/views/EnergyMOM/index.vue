<template>
  <div class="EnergyMOM flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree
          ref="circuitInfoTreeRef"
          :show-cascade="true"
          :show-all="true"
          :is-multiple="true"
          :on-change="onCircuitInfoTreeChange"
        />
      </CollapseBox>
      <div class="card content-box">
        <el-tabs @tab-change="tabClick" v-model="activeTab">
          <el-tab-pane lazy label="按日" name="day" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="日期">
                <el-date-picker v-model="formInline.starttime" type="date" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="onExport(dayColumns, '日')">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="dayColumns" :fetch-data="fetchData">
              <template #actions="{ row }">
                <el-button ltype="primary" size="mini" bg text @click="showChart(row)">查看图表</el-button>
              </template>
            </PaginationTable>
          </el-tab-pane>
          <el-tab-pane lazy label="按周" name="week" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="日期">
                <el-date-picker v-model="formInline.starttime" type="date" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="onExport(weekColumns, '周')">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="weekColumns" :fetch-data="fetchData">
              <template #actions="{ row }">
                <el-button ltype="primary" size="mini" bg text @click="showChart(row)">查看图表</el-button>
              </template>
            </PaginationTable>
          </el-tab-pane>
          <el-tab-pane lazy label="按月" name="month" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="日期">
                <el-date-picker v-model="formInline.starttime" type="month" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="onExport(monthColumns, '月')">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="monthColumns" :fetch-data="fetchData">
              <template #actions="{ row }">
                <el-button ltype="primary" size="mini" bg text @click="showChart(row)">查看图表</el-button>
              </template>
            </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="currentRow?.circuitname" width="500">
      <span class="chart-text">增长值：{{ currentRow.diffvalue || "-" }}kW·h 增长率：{{ currentRow.momvalue || "-" }}%</span>
      <div class="chart-box">
        <ECharts v-if="option !== null" :option="option" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="EnergyMOM">
import { ref, reactive } from "vue";
import moment from "moment";
import { energyReportMOM } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { ElMessage } from "element-plus";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { getContextStationId } from "@/utils";
import { exportExcel } from "@/utils/exportExcel";

const tableRef = ref<any>(null);
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const option = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const activeTab = ref<"day" | "week" | "month">("day");

const formInline = reactive<{
  starttime: string;
  scheme: "M" | "D" | "W";
}>({
  starttime: moment().format("YYYY-MM-DD"),
  scheme: "D"
});

const dayColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "curvalue", label: "当日用电 / kW·h" },
  { prop: "beforevalue", label: "上日用电 / kW·h" },
  { prop: "diffvalue", label: "增加值" },
  { prop: "momvalue", label: "环比(%)" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 120 }
];

const weekColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "curvalue", label: "当周用电 / kW·h" },
  { prop: "beforevalue", label: "上周用电 / kW·h" },
  { prop: "diffvalue", label: "增加值" },
  { prop: "momvalue", label: "环比(%)" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 120 }
];

const monthColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "curvalue", label: "当月用电 / kW·h" },
  { prop: "beforevalue", label: "上月用电 / kW·h" },
  { prop: "diffvalue", label: "增加值" },
  { prop: "momvalue", label: "环比(%)" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 120 }
];

const showChart = value => {
  dialogVisible.value = true;
  currentRow.value = value;
  // row.value = value;
  let curvalueText, beforevalueText;
  if (formInline.scheme === "D") {
    curvalueText = "当日用电";
    beforevalueText = "上日用电";
  }
  if (formInline.scheme === "M") {
    curvalueText = "当月用电";
    beforevalueText = "上月用电";
  }
  if (formInline.scheme === "W") {
    curvalueText = "当周用电";
    beforevalueText = "上周用电";
  }
  option.value = {
    grid: {
      left: 20,
      right: 20,
      bottom: 20,
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
    legend: {
      data: [curvalueText, beforevalueText]
    },
    xAxis: [
      {
        type: "category",
        data: [value.circuitname],
        axisPointer: {
          type: "shadow"
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "单位（kW.h）"
      }
    ],
    series: [
      {
        name: curvalueText,
        type: "bar",
        data: [Number(value.curvalue)]
      },
      {
        name: beforevalueText,
        type: "bar",
        data: [Number(value.beforevalue)]
      }
    ]
  };
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      starttime: moment(formInline.starttime).format("YYYY-MM-DD"),
      scheme: formInline.scheme
    };
    const { data } = await energyReportMOM(params);
    console.log("datadatadata", data);
    if (!data) {
      resolve({ list: [] });
    } else {
      resolve({ list: data.PowerValue });
    }
    // console.log("dataa", data);
  });
};

const onExport = async (columns, type) => {
  const params: any = {
    stationid: getContextStationId(),
    circuitids: circuit.value,
    starttime: moment(formInline.starttime).format("YYYY-MM-DD"),
    scheme: formInline.scheme
  };

  const textKeyMaps = columns.map(({ label, prop }) => {
    return { [label]: prop };
  });

  const { data } = await energyReportMOM(params);

  exportExcel({
    data: data?.PowerValue || [],
    textKeyMaps,
    filename: `${moment(formInline.starttime).format("YYYY-MM-DD")}_${type}数据.xlsx`
  });
};

const onContextStationChange = async () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  if (circuitids.length === 0) return ElMessage.info({ message: "请至少选择一个回路" });
  circuit.value = circuitids.join("-");
  tableRef?.value?.resetData();
};

const tabClick = () => {
  if (activeTab.value === "day") formInline.scheme = "D";
  if (activeTab.value === "week") formInline.scheme = "W";
  if (activeTab.value === "month") formInline.scheme = "M";
  window.setTimeout(() => tableRef?.value?.resetData());
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
