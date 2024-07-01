<template>
  <div class="UnbMonitor flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box">
        <el-tree
          default-expand-all
          style="max-width: 600px"
          :data="tree"
          show-checkbox
          node-key="regionid"
          :default-checked-keys="[100]"
          :props="props"
        />
      </div>
      <div class="card content-box">
        <el-tabs>
          <el-tab-pane label="日原始数据" class="content-pane">
            <div class="flex-column">
              <el-form :inline="true" :model="formInline" class="table-form-inline">
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="formInline.date"
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
                  <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
                    <el-option label="三相电流不平衡度" value="shanghai" />
                    <el-option label="三相电压不平衡度" value="beijing" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                  <el-button type="primary" @click="onSubmit">设置</el-button>
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
          </el-tab-pane>
          <el-tab-pane label="逐日极值数据" class="content-pane" lazy>
            <div class="flex-column">
              <el-form :inline="true" :model="formInline" class="table-form-inline">
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="formInline.date"
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
                  <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
                    <el-option label="三相电流不平衡度" value="shanghai" />
                    <el-option label="三相电压不平衡度" value="beijing" />
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
                  <PaginationTable :columns="columns2" :fetch-data="fetchData"> </PaginationTable>
                </el-tab-pane>
              </el-tabs>
            </div>
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
import { ECOption } from "@/components/Charts/config";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";

const tree = ref([] as any);
const props = { children: "children", label: "circuitname" };

const size = ref<"default" | "large" | "small">("default");

// const value1 = ref("");
// const value2 = ref("");

const columns = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "采集时间" }
];

const columns2 = [
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

onMounted(async () => {
  const res = await getCircuitInfoTree();
  tree.value = res?.data;
});

const option: ECOption = {
  title: {
    text: "三相电流不平衡度"
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
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
