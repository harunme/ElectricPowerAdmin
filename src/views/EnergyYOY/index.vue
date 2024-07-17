<template>
  <div class="EnergyYOY flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="year" />
          </el-form-item>
          <el-form-item>
            <el-button-group type="primary">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一年
              </el-button>
              <el-button @click="clickNext">
                下一年<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="chart-box">
          <ECharts v-if="option !== null" :option="option" />
        </div>
        <div class="table-box">
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { ref, reactive } from "vue";
import moment from "moment";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { getMonthMom } from "@/api/modules/main";
import ECharts from "@/components/Charts/echarts.vue";

const tableRef = ref<any>(null);
const option = ref<any>(null);

const formInline = reactive({
  starttime: moment().format("YYYY")
});

const columns = [
  { prop: "collecttime", label: "月份" },
  { prop: "data", label: "本期" },
  { prop: "predata", label: "同期" },
  { prop: "yoyvalue", label: "同比(%)" },
  { prop: "sumyoyvalue", label: "累计同比(%)" }
];

const clickPrev = () => {
  formInline.starttime = moment(formInline.starttime).subtract(1, "y").format("YYYY");
  tableRef?.value?.resetData();
};

const clickNext = () => {
  formInline.starttime = moment(formInline.starttime).add(1, "y").format("YYYY");
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: "000",
      circuitid: "000",
      starttime: `${formInline.starttime}-01-01`
    };
    const { data } = await getMonthMom(params);

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
        data: ["正向有功电度", "反向有功电度", "正向无功电度", "反向无功电度"]
      },
      xAxis: [
        {
          type: "category",
          data: data.PowerValue.map(({ collecttime }) => collecttime),
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "kW.h"
        }
      ],
      series: [
        {
          name: "本期",
          type: "bar",
          data: data.PowerValue.map(({ predata }) => Number(predata))
        },
        {
          name: "同期",
          type: "bar",
          data: data.PowerValue.map(({ data }) => Number(data))
        }
      ]
    };
    resolve({ list: data.PowerValue });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
