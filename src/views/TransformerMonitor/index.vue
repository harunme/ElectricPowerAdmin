<template>
  <div class="TransformerMonitor">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="right-box">
        <div class="card top-box">
          <p>
            <span>1#变压器状态</span>
            <span>更新时间：2024-06-27 22:12:12</span>
          </p>
          <div>
            <el-row :gutter="8">
              <el-col :span="4">
                <div class="status">
                  <span>负荷</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="额定容量">1600kVA</el-descriptions-item>
                    <el-descriptions-item label="视在功率">923.00kVA</el-descriptions-item>
                    <el-descriptions-item label="负载率">57.69%</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="status">
                  <span>功率</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="有功功率">895.00kW</el-descriptions-item>
                    <el-descriptions-item label="无功功率">223.00kVar</el-descriptions-item>
                    <el-descriptions-item label="功率因数">0.97</el-descriptions-item>
                    <el-descriptions-item label="当月最大需量">-</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="status">
                  <span>电流</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="额定电流">-</el-descriptions-item>
                    <el-descriptions-item label="A相电流">1338.00A</el-descriptions-item>
                    <el-descriptions-item label="B相电流">1338.00A</el-descriptions-item>
                    <el-descriptions-item label="C相电流">1338.00A</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="status">
                  <span>电压</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="Uab线电压">396.70V</el-descriptions-item>
                    <el-descriptions-item label="Ubc线电压">396.70V</el-descriptions-item>
                    <el-descriptions-item label="Uca线电压">396.70V</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="status">
                  <span>温度</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="A相绕组温度">38.90℃</el-descriptions-item>
                    <el-descriptions-item label="B相绕组温度">38.90℃</el-descriptions-item>
                    <el-descriptions-item label="C相绕组温度">-30.00℃</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="status">
                  <span>噪声</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="噪声">-</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="card bottom-box">
          <el-form :inline="true" :model="formInline" class="table-form-inline">
            <el-form-item label="日期">
              <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
                <el-option label="视在功率" value="shanghai" />
                <el-option label="有功功率" value="beijing" />
                <el-option label="无功功率" value="beijing" />
                <el-option label="功率因数" value="beijing" />
                <el-option label="相电压" value="beijing" />
                <el-option label="线电压" value="beijing" />
                <el-option label="电流" value="beijing" />
                <el-option label="绕组温度" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button>
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
                </el-button>
                <el-button>
                  下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
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
// const props = { children: "children", label: "circuitname" };

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
    number.value = {
      red: data.red,
      yellow: data.yellow,
      green: data.green
    };
    pieData.value[0].value = data.red;
    pieData.value[1].value = data.yellow;
    pieData.value[2].value = data.green;
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
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
