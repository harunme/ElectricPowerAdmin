<template>
  <div class="QuadrantElectricity flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.type" placeholder="Activity zone" clearable>
              <el-option label="日报" value="yuebao" />
              <el-option label="月报" value="yuebao" />
              <el-option label="年报" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button>
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button>
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="chart-box">
          <ECharts :option="option" />
        </div>
        <PaginationTable :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { reactive } from "vue";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import data from "./data.json";

const formInline = reactive({
  type: "yuebao",
  date: "",
  time: "1min"
});

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
  { prop: "fSubname", label: "回路名称" },
  { prop: "fTransname", label: "日期" },
  { prop: "transformername", label: "正向有功电度" },
  { prop: "transformername", label: "反向有功电度" },
  { prop: "transformername", label: "正向无功电度" },
  { prop: "transformername", label: "反向无功电度" }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], total: 0 });
  });
};

const option: ECOption = {
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
      data: data.data.list.map(({ f_Date }) => f_Date),
      axisPointer: {
        type: "shadow"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "有功电度/无功电度"
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
      data: data.data.list.map(({ epi }) => epi)
    },
    {
      name: "反向有功电度",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " ml";
        }
      },
      data: data.data.list.map(({ epe }) => epe)
    },
    {
      name: "正向无功电度",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " ml";
        }
      },
      data: data.data.list.map(({ eql }) => eql)
    },
    {
      name: "反向无功电度",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " ml";
        }
      },
      data: data.data.list.map(({ eqc }) => eqc)
    }
  ]
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
