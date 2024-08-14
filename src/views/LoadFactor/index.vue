<template>
  <div class="LoadFactor flex-column">
    <TransformerSelect />
    <div class="main-box">
      <CollapseBox />
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme" @change="changeScheme">
              <el-option label="月报" value="M" />
              <el-option label="年报" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" :type="formInline.scheme === 'M' ? 'month' : 'year'" />
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
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <div class="chart-box">
          <ECharts v-if="option !== null" :option="option" />
        </div>
        <div class="table-box">
          <PaginationTable ref="tableRef" :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData">
          </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="LoadFactor">
import { ref, reactive } from "vue";
import moment from "moment";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { GetCirLoadRate } from "@/api/modules/main";

const formInline = reactive<{
  scheme: "M" | "Y";
  starttime: string;
}>({
  scheme: "M",
  starttime: moment().format("YYYY-MM")
});

const tableRef = ref<any>(null);
const option = ref<any>(null);

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

const columns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "日期" },
  {
    label: "有功功率(kW)",
    children: [
      { prop: "fPAverag", label: "平均值" },
      { prop: "fPMaxValue", label: "最大值" }
    ]
  },
  { prop: "fPLoadRate", label: "负荷率(%)" }
];

const changeScheme = value => {
  if (value === "M") {
    formInline.starttime = moment().format("YYYY-MM");
  } else {
    formInline.starttime = moment().format("YYYY");
  }
};

const clickPrev = () => {
  if (formInline.scheme === "M") formInline.starttime = moment(formInline.starttime).subtract(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).subtract(1, "y").format("YYYY");
  tableRef?.value?.resetData();
};

const clickNext = () => {
  if (formInline.scheme === "M") formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  if (formInline.scheme === "Y") formInline.starttime = moment(formInline.starttime).add(1, "y").format("YYYY");
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: "000",
      circuitid: "000",
      scheme: formInline.scheme,
      starttime: formInline.starttime
    };
    const { data } = await GetCirLoadRate(params);
    const list = data?.PowerValue || [];
    option.value = {
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 30,
        containLabel: true
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
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
      yAxis: {
        name: "负荷率",
        type: "value"
      },
      series: [
        {
          type: "line",
          smooth: 0.6,
          lineStyle: {
            color: "#ffba00",
            width: 3
          },
          data: list.map(({ fPLoadRate }) => Number(fPLoadRate))
        }
      ]
    };
    resolve({ list, total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
