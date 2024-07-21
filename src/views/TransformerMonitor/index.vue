<template>
  <div class="TransformerMonitor">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="right-box">
        <div class="card top-box">
          <p>
            <span>1#变压器状态</span>
            <span>更新时间：{{ moment().format("YYYY-MM-DD HH:mm:ss") }}</span>
          </p>
          <div>
            <el-row :gutter="8">
              <el-col :span="4">
                <div class="status">
                  <span>负荷</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="额定容量">{{ TransformerStatus.fInstalledcapacity }}</el-descriptions-item>
                    <el-descriptions-item label="视在功率">{{ TransformerStatus.fS }}</el-descriptions-item>
                    <el-descriptions-item label="负载率">{{ TransformerStatus.loadFactor }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="status">
                  <span>功率</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="有功功率">{{ TransformerStatus.fP }}</el-descriptions-item>
                    <el-descriptions-item label="无功功率">{{ TransformerStatus.fQ }}</el-descriptions-item>
                    <el-descriptions-item label="功率因数">{{ TransformerStatus.fPF }}</el-descriptions-item>
                    <el-descriptions-item label="当月最大需量">{{ TransformerStatus.maxDemand }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="status">
                  <span>电流</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="额定电流">{{ TransformerStatus.fRatedcurrent }}</el-descriptions-item>
                    <el-descriptions-item label="A相电流">{{ TransformerStatus.fIa }}</el-descriptions-item>
                    <el-descriptions-item label="B相电流">{{ TransformerStatus.fIb }}</el-descriptions-item>
                    <el-descriptions-item label="C相电流">{{ TransformerStatus.fIc }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="status">
                  <span>电压</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="Uab线电压">{{ TransformerStatus.fUab }}</el-descriptions-item>
                    <el-descriptions-item label="Ubc线电压">{{ TransformerStatus.fUbc }}</el-descriptions-item>
                    <el-descriptions-item label="Uca线电压">{{ TransformerStatus.fUca }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="status">
                  <span>温度</span>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="A相绕组温度">{{ TransformerStatus.fTempA }}</el-descriptions-item>
                    <el-descriptions-item label="B相绕组温度">{{ TransformerStatus.fTempB }}</el-descriptions-item>
                    <el-descriptions-item label="C相绕组温度">{{ TransformerStatus.fTempC }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="card bottom-box">
          <el-form :inline="true" :model="formInline" class="table-form-inline">
            <el-form-item label="日期">
              <el-date-picker @change="onTimeChange" v-model="formInline.starttime" type="date" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select @change="onParamsChange" v-model="formInline.params">
                <el-option :key="item.value" v-for="item in ParamsOptions" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group type="primary">
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
                </el-button>
                <el-button @click="clickNext">
                  下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
          <el-tabs>
            <el-tab-pane label="图表" class="chart-box">
              <ECharts v-if="option !== null" :option="option" />
              <el-empty v-else description="暂无数据" />
            </el-tab-pane>
            <el-tab-pane label="数据" class="chart-box">
              <PaginationTable ref="tableRef" :columns="columns[formInline.params]" :fetch-data="fetchData"> </PaginationTable>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="TransformerMonitor">
import { ref, reactive, onMounted } from "vue";
import { getCurveDataOfPowerAndTempABCNew, TransformerMonitor } from "@/api/modules/main";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import moment from "moment";
import columns from "./config";

const ParamsOptions = [
  { label: "视在功率", value: "S" },
  { label: "有功功率", value: "P" },
  { label: "无功功率", value: "Q" },
  { label: "功率因数", value: "Pf" },
  { label: "相电压", value: "Pv" },
  { label: "线电压", value: "Lv" },
  { label: "电流", value: "I" },
  { label: "绕组温度", value: "Temp" }
];

const option = ref<any>(null);
const tableRef = ref<any>(null);
const formInline = reactive<{
  params: "S" | "P" | "Q" | "Pf" | "Pv" | "I" | "Temp" | "Lv";
  starttime: string;
}>({
  params: "S",
  starttime: moment().format("YYYY-MM-DD")
});

const TransformerStatus = ref<any>({
  fIa: "0.00A",
  fIb: "0.00A",
  fIc: "0.00A",
  fP: "0.00kw",
  fPF: "0.00",
  fQ: "0.00KVar",
  fS: "0.00KVA",
  fTempA: "0.00℃",
  fTempB: "0.00℃",
  fTempC: "0.00℃",
  fUab: "0.00V",
  fUbc: "0.00V",
  fUca: "0.00V",
  fInstalledcapacity: 400,
  fRatedcurrent: "-",
  loadFactor: "0.00%",
  maxDemand: 0.0,
  loadRate: 0.0,
  averageVal: 0.0
});

const clickPrev = () => {
  formInline.starttime = moment(formInline.starttime).subtract(1, "d").format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const clickNext = () => {
  formInline.starttime = moment(formInline.starttime).add(1, "d").format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const onTimeChange = value => {
  formInline.starttime = moment(value).format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const onParamsChange = () => {
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      transformerid: "0",
      starttime: formInline.starttime,
      params: formInline.params as "S" | "P" | "Q" | "Pf" | "U" | "I" | "Temp"
    };
    let legend = [] as any[];
    let xAxisData = [] as any[];
    let series = [] as any[];

    if (formInline.params === "Lv" || formInline.params === "Pv") {
      params.params = "U";
    }
    const { data } = await getCurveDataOfPowerAndTempABCNew(params);

    if (data === null) {
      option.value = null;
      resolve({ list: [] });
    } else {
      if (formInline.params === "S" || formInline.params === "P" || formInline.params === "Q" || formInline.params === "Pf") {
        resolve({
          list: data.origPower.map((item, index) => ({
            collecttime: moment(item.collecttime).format("HH:mm"),
            value: item.fP,
            yesterdayValue: data.yesterdayOrigPower[index].fP
          }))
        });
        legend = ["上日", "当日"];
        xAxisData = data.yesterdayOrigPower.map(({ collecttime }) => moment(collecttime).format("HH:mm"));
        series = [
          {
            name: "当日",
            type: "line",
            stack: "Total",
            data: data.origPower.map(({ fP }) => Number(fP))
          },
          {
            name: "上日",
            type: "line",
            stack: "Total",
            data: data.yesterdayOrigPower.map(({ fP }) => Number(fP))
          }
        ];
      }

      if (formInline.params === "I") {
        resolve({
          list: data.origPower.map(item => ({
            collecttime: moment(item.collecttime).format("HH:mm"),
            A: item.fIa,
            B: item.fIb,
            C: item.fIc
          }))
        });
        legend = ["A相", "B相", "C相"];
        xAxisData = data.origPower.map(({ collecttime }) => moment(collecttime).format("HH:mm"));
        series = [
          {
            name: "A相",
            type: "line",
            stack: "Total",
            data: data.origPower.map(({ fIa }) => (fIa ? Number(fIa) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "B相",
            data: data.origPower.map(({ fIb }) => (fIb ? Number(fIb) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "C相",
            data: data.origPower.map(({ fIc }) => (fIc ? Number(fIc) : 0))
          }
        ];
      }

      if (formInline.params === "Lv" || formInline.params === "Pv") {
        resolve({
          list: data.origPower.map(item => ({
            collecttime: moment(item.collecttime).format("HH:mm"),
            A: item.Ua,
            B: item.Ub,
            C: item.Uc
          }))
        });
        legend = ["A相", "B相", "C相"];
        xAxisData = data.origPower.map(({ collecttime }) => moment(collecttime).format("HH:mm"));
        series = [
          {
            name: "A相",
            type: "line",
            stack: "Total",
            data: data.origPower.map(({ Ua }) => (Ua ? Number(Ua) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "B相",
            data: data.origPower.map(({ Ub }) => (Ub ? Number(Ub) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "C相",
            data: data.origPower.map(({ Uc }) => (Uc ? Number(Uc) : 0))
          }
        ];
      }

      if (formInline.params === "Temp") {
        resolve({
          list: data.origPower.map(item => ({
            collecttime: moment(item.collecttime).format("HH:mm"),
            A: item.fTempA,
            B: item.fTempB,
            C: item.fTempC
          }))
        });
        legend = ["A相", "B相", "C相"];
        xAxisData = data.origPower.map(({ collecttime }) => moment(collecttime).format("HH:mm"));
        series = [
          {
            name: "A相",
            type: "line",
            stack: "Total",
            data: data.origPower.map(({ fTempA }) => (fTempA ? Number(fTempA) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "B相",
            data: data.origPower.map(({ fTempB }) => (fTempB ? Number(fTempB) : 0))
          },
          {
            name: "上日",
            type: "line",
            stack: "C相",
            data: data.origPower.map(({ fTempC }) => (fTempC ? Number(fTempC) : 0))
          }
        ];
      }

      option.value = {
        title: {
          text: `${formInline.starttime}   ${ParamsOptions.find(item => item.value === formInline.params)?.["label"]}`
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legend
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
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: series
      };
    }
  });
};

onMounted(async () => {
  const { data } = await TransformerMonitor({
    stationid: "000",
    transformerid: "0"
  });
  TransformerStatus.value = data.TransformerStatus;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
