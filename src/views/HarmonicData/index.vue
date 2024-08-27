<template>
  <div class="HarmonicData flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card content-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="时间范围">
            <el-date-picker v-model="formInline.time" type="date" :size="size" style="width: 132px" />
          </el-form-item>
          <el-form-item label="谐波类型">
            <el-select v-model="formInline.energyKind" style="width: 132px">
              <el-option label="电流谐波" value="I" />
              <el-option label="电压谐波" value="U" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formInline.phase">
              <el-checkbox-button label="A相" value="a" />
              <el-checkbox-button label="B相" value="b" />
              <el-checkbox-button label="C相" value="c" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择">
            <el-select v-model="formInline.thdtype" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable>
              <el-option label="总谐波" value="fThd" />
              <el-option label="2次谐波含量" value="fHr02" />
              <el-option label="3次谐波含量" value="fHr03" />
              <el-option label="4次谐波含量" value="fHr04" />
              <el-option label="5次谐波含量" value="fHr05" />
              <el-option label="6次谐波含量" value="fHr06" />
              <el-option label="7次谐波含量" value="fHr07" />
              <el-option label="8次谐波含量" value="fHr08" />
              <el-option label="9次谐波含量" value="fHr09" />
              <el-option label="10次谐波含量" value="fHr10" />
              <el-option label="11次谐波含量" value="fHr11" />
              <el-option label="12次谐波含量" value="fHr12" />
              <el-option label="13次谐波含量" value="fHr13" />
              <el-option label="14次谐波含量" value="fHr14" />
              <el-option label="15次谐波含量" value="fHr15" />
              <el-option label="16次谐波含量" value="fHr16" />
              <el-option label="17次谐波含量" value="fHr17" />
              <el-option label="18次谐波含量" value="fHr18" />
              <el-option label="19次谐波含量" value="fHr19" />
              <el-option label="20次谐波含量" value="fHr20" />
              <el-option label="21次谐波含量" value="fHr21" />
              <el-option label="22次谐波含量" value="fHr22" />
              <el-option label="23次谐波含量" value="fHr23" />
              <el-option label="24次谐波含量" value="fHr24" />
              <el-option label="25次谐波含量" value="fHr25" />
              <el-option label="26次谐波含量" value="fHr26" />
              <el-option label="27次谐波含量" value="fHr27" />
              <el-option label="28次谐波含量" value="fHr28" />
              <el-option label="29次谐波含量" value="fHr29" />
              <el-option label="30次谐波含量" value="fHr30" />
              <el-option label="31次谐波含量" value="fHr31" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-tabs>
          <el-tab-pane label="图表" class="chart-box">
            <ECharts :option="option" />
          </el-tab-pane>
          <el-tab-pane label="数据" class="chart-box">
            <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
            </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="HarmonicData">
import { ref, reactive } from "vue";
import { ThreePhaseHarmonic } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { getContextStationId } from "@/utils";

const size = ref<"default" | "large" | "small">("default");
const tableRef = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const columns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "date", label: "采集时间" },
  { prop: "transformername", label: "A相Thd" }
];

const formInline = reactive({
  energyKind: "I" as "I" | "U",
  time: "2024-06-01",
  thdtype: ["fThd"],
  phase: ["a", "b", "c"]
});

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    console.log("form", formInline);
    const { data } = await ThreePhaseHarmonic({
      stationid: getContextStationId(),
      circuitids: circuit.value,
      time: formInline.time,
      energyKind: formInline.energyKind,
      thdtype: formInline.thdtype.join("-"),
      phase: formInline.phase.join(",")
    });
    resolve({ list: data?.PowerValue });
  });
};

// onMounted(async () => {
//   const res = await getCircuitInfoTree();
//   tree.value = res?.data;
// });

const option: ECOption = {
  title: {
    text: "电流谐波"
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

const onSubmit = () => {
  tableRef?.value?.resetData();
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
