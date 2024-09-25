<template>
  <div class="EnergyData flex-column">
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
        <el-tabs v-model="activeTab" @tab-click="tabClick">
          <el-tab-pane label="日报" name="D"> </el-tab-pane>
          <el-tab-pane label="月报" name="M"> </el-tab-pane>
          <el-tab-pane label="年报" name="Y"> </el-tab-pane>
        </el-tabs>
        <div style="height: calc(100% - 118px)">
          <el-form :inline="true" class="table-form-inline">
            <el-form-item v-if="activeTab === 'D'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="date" :clearable="false" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in [...Array(24).keys()]" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">时 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in [...Array(24).keys()]" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">时</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'D'">
              <el-button-group>
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
                </el-button>
                <el-button @click="clickNext">
                  下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item v-if="activeTab === 'M'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="month" :clearable="false" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in moment(lineForm.date).daysInMonth()" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">日 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in moment(lineForm.date).daysInMonth()" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">日</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'M'">
              <el-button-group>
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
                </el-button>
                <el-button @click="clickNext">
                  下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item v-if="activeTab === 'Y'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="year" :clearable="false" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in Array.from({ length: 12 }, (_, i) => i + 1)" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">月 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in Array.from({ length: 12 }, (_, i) => i + 1)" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">月</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'Y'">
              <el-button-group>
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
              <el-button @click="showChart">图表</el-button>
              <el-button @click="showPie">饼图</el-button>
              <el-button @click="onExport">导出</el-button>
              <div style="margin-left: 8px; color: var(--el-text-color-regular)">(*为进线回路)</div>
            </el-form-item>
          </el-form>
          <el-dialog v-model="dialogVisible" title="用能柱状图" width="500">
            <div class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
            </div>
          </el-dialog>
          <PaginationTable
            ref="tableRef"
            :fetch-on-mounted="false"
            :columns="columns"
            :fetch-data="fetchData"
            :selection-change="handleSelectionChange"
          >
          </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyData">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import moment from "moment";
import { ElectricityFeesNoHj } from "@/api/modules/main";
import CollapseBox from "@/components/CollapseBox/index.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { getContextStationId } from "@/utils";
import { exportExcel } from "@/utils/exportExcel";

const circuit = ref<any>(null);
const option = ref<any>(null);
const tableRef = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const dialogVisible = ref(false);
const ElectricityFeesNoHjResponse = ref<any>(null);
const activeTab = ref<"D" | "M" | "Y">("D");
// const props = { children: "children", label: "circuitname" };

const lineForm = reactive({
  date: moment().format("YYYY-MM-DD"),
  starttime: 0,
  endtime: 23
});

const columns = ref<any>([]);
const selectedRows = ref<any>([]);

const tabClick = tab => {
  if (tab.paneName === "D") {
    lineForm.date = moment().format("YYYY-MM-DD");
    lineForm.starttime = 0;
    lineForm.endtime = 23;
  }
  if (tab.paneName === "M") {
    lineForm.date = moment().format("YYYY-MM");
    lineForm.starttime = 1;
    lineForm.endtime = moment().daysInMonth();
  }
  if (tab.paneName === "Y") {
    lineForm.date = moment().format("YYYY");
    lineForm.starttime = 1;
    lineForm.endtime = moment().month() + 1;
  }
  activeTab.value = tab.paneName;
  tableRef?.value?.resetData();
};

const clickPrev = () => {
  if (activeTab.value === "D") lineForm.date = moment(lineForm.date).subtract(1, "d").format("YYYY-MM-DD");
  if (activeTab.value === "M") lineForm.date = moment(lineForm.date).subtract(1, "M").format("YYYY-MM");
  if (activeTab.value === "Y") lineForm.date = moment(lineForm.date).subtract(1, "y").format("YYYY");
};

const clickNext = () => {
  if (activeTab.value === "D") lineForm.date = moment(lineForm.date).add(1, "d").format("YYYY-MM-DD");
  if (activeTab.value === "M") lineForm.date = moment(lineForm.date).add(1, "M").format("YYYY-MM");
  if (activeTab.value === "Y") lineForm.date = moment(lineForm.date).add(1, "y").format("YYYY");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    if (lineForm.starttime > lineForm.endtime) {
      return ElMessage.info({ message: "开始时间必须小于截止时间" });
    }
    let starttime, endtime;
    if (activeTab.value === "D") {
      starttime = `${moment(lineForm.date).format("YYYY-MM-DD")} ${Number(lineForm.starttime) < 10 ? `0${lineForm.starttime}` : lineForm.starttime}:00:00`;
      endtime = `${moment(lineForm.date).format("YYYY-MM-DD")} ${Number(lineForm.endtime) < 10 ? `0${lineForm.endtime}` : lineForm.endtime}:00:00`;
    }
    if (activeTab.value === "M") {
      starttime = `${moment(lineForm.date).format("YYYY-MM")}-${lineForm.starttime < 10 ? `0${lineForm.starttime}` : lineForm.starttime}`;
      endtime = `${moment(lineForm.date).format("YYYY-MM")}-${lineForm.endtime < 10 ? `0${lineForm.endtime}` : lineForm.endtime}`;
    }
    if (activeTab.value === "Y") {
      starttime = `${moment(lineForm.date).format("YYYY")}-${lineForm.starttime < 10 ? `0${lineForm.starttime}` : lineForm.starttime}`;
      endtime = `${moment(lineForm.date).format("YYYY")}-${lineForm.endtime < 10 ? `0${lineForm.endtime}` : lineForm.endtime}`;
    }
    const { data } = await ElectricityFeesNoHj({
      stationid: getContextStationId(),
      circuitids: circuit.value,
      scheme: activeTab.value,
      starttime,
      endtime
    });
    ElectricityFeesNoHjResponse.value = data?.EnergyReport || [];
    const EnergyReport = getData(data?.EnergyReport || []);
    columns.value = EnergyReport.columns;

    resolve({ list: EnergyReport.list });
  });
};

const getData = data => {
  let columns: any = [];
  const list =
    data.map((row: any, index) => {
      let data: any = {};
      let total: number = 0;
      if (index === 0) {
        data.circuitname = row[0].circuitname;
        columns.push({ prop: "circuitname", label: "回路名称 / kW·h", width: 160 });
        row.forEach(item => {
          columns.push({
            prop: item.collecttime,
            label: item.collecttime
          });
          data[item.collecttime] = item.data;
          total += item.data;
        });
        columns.push({ prop: "total", label: "合计" });
        data.total = total;
      }
      return data;
    }) || [];
  return { columns, list };
};

const handleSelectionChange = rows => {
  selectedRows.value = rows;
};

const showChart = () => {
  if (selectedRows.value.length === 0) return ElMessage.info({ message: "请先选择一行数据" });
  dialogVisible.value = true;

  let legend: any = [];
  let xAxisData: any = [];
  let series: any = [];
  selectedRows.value.forEach((row: any) => {
    const { circuitname, total, ...rest } = row;

    const data = ElectricityFeesNoHjResponse.value.find(data => data[0].circuitname === circuitname);
    console.log("datadata", data, rest, total);
    legend.push(circuitname);
    series.push({
      name: circuitname,
      type: "bar",
      data: data.map(({ data }) => data)
    });
    xAxisData = data.map(({ collecttime }) => collecttime);
  });

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
      data: legend
    },
    xAxis: [
      {
        type: "category",
        data: xAxisData,
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
    series: series
  };
};

const onExport = async () => {
  const typeMap = {
    D: "用能日报",
    M: "用能月报",
    Y: "用能年报"
  };
  if (lineForm.starttime > lineForm.endtime) {
    return ElMessage.info({ message: "开始时间必须小于截止时间" });
  }
  let starttime, endtime;
  if (activeTab.value === "D") {
    starttime = `${lineForm.date} ${Number(lineForm.starttime) < 10 ? `0${lineForm.starttime}` : lineForm.starttime}:00:00`;
    endtime = `${lineForm.date} ${Number(lineForm.endtime) < 10 ? `0${lineForm.endtime}` : lineForm.endtime}:00:00`;
  }
  if (activeTab.value === "M" || activeTab.value === "Y") {
    starttime = `${lineForm.date}-${lineForm.starttime < 10 ? `0${lineForm.starttime}` : lineForm.starttime}`;
    endtime = `${lineForm.date}-${lineForm.endtime < 10 ? `0${lineForm.endtime}` : lineForm.endtime}`;
  }
  const { data } = await ElectricityFeesNoHj({
    stationid: getContextStationId(),
    circuitids: circuit.value,
    scheme: activeTab.value,
    starttime,
    endtime
  });

  const EnergyReport = getData(data.EnergyReport);

  let textKeyMaps = [] as any;
  columns.value.forEach(({ children, label, prop, slotName }) => {
    if (children) {
      children.forEach(item => {
        if (item.children) {
          item.children.forEach(subitem => {
            textKeyMaps.push({ [`${label}.${item.label}.${subitem.label}`]: subitem.slotName || subitem.prop });
          });
        } else textKeyMaps.push({ [`${label}.${item.label}`]: item.slotName || item.prop });
      });
    } else textKeyMaps.push({ [label]: slotName || prop });
  });
  exportExcel({
    data: EnergyReport.list,
    textKeyMaps,
    filename: `${starttime}-${endtime}_${typeMap[activeTab.value]}.xlsx`
  });
};
const showPie = () => {
  console.log("showPie");
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onContextStationChange = async () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  if (circuitids.length === 0) return ElMessage.info({ message: "请至少选择一个回路" });
  circuit.value = circuitids.join("-");
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
