<template>
  <div class="HarmonicData flex-column">
    <TransformerSelect />
    <div class="main-box">
      <CollapseBox />
      <div class="card content-box">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="时间范围">
            <el-date-picker v-model="formInline.date" type="date" :size="size" />
          </el-form-item>
          <el-form-item label="谐波类型">
            <el-select v-model="formInline.region">
              <el-option label="电流谐波" value="shanghai" />
              <el-option label="电压谐波" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formInline.EnergyKindPhase">
              <el-checkbox label="A相" value="Value A" />
              <el-checkbox label="B相" value="Value B" />
              <el-checkbox label="C相" value="Value C" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择">
            <el-select v-model="formInline.region" clearable>
              <el-option label="电流谐波" value="shanghai" />
              <el-option label="电压谐波" value="beijing" />
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
            <PaginationTable :columns="columns" :fetch-data="fetchData"> </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { onMounted, ref, reactive } from "vue";
import { getCircuitInfoTree } from "@/api/modules/sys";
import { ReqPage } from "@/api/interface/index";
import { summary } from "@/api/modules/main";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";

const tree = ref([] as any);
// const props = { children: "children", label: "circuitname" };

const size = ref<"default" | "large" | "small">("default");
const columns = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "采集时间" },
  { prop: "transformername", label: "A相Thd" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await summary({
      pageNum,
      pageSize,
      sortParam: "001",
      sortTag: "ASC"
    });
    resolve(data.pageInfo);
  });
};

onMounted(async () => {
  const res = await getCircuitInfoTree();
  tree.value = res?.data;
});

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

const formInline = reactive({
  user: "",
  region: "shanghai",
  date: "",
  EnergyKindPhase: ""
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
