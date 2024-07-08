<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box">
        <CircuitInfoTree />
      </div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
          </el-form-item>
          <el-form-item label="电压类别">
            <el-select v-model="formInline.type">
              <el-option label="全部" value="shanghai" />
              <el-option label="相电压" value="beijing" />
              <el-option label="线电压" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间间隔">
            <el-select v-model="formInline.time">
              <el-option label="一分钟" value="1min" />
              <el-option label="五分钟" value="5min" />
              <el-option label="十五分钟" value="15min" />
              <el-option label="半小时" value="30min" />
              <el-option label="一小时" value="60min" />
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
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { reactive } from "vue";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";

const formInline = reactive({
  type: "shanghai",
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
  { prop: "fTransname", label: "采集时间" },
  { prop: "transformername", label: "Epi(kWh)" },
  { prop: "transformername", label: "Ua(V)" },
  { prop: "transformername", label: "Ub(V)" },
  { prop: "transformername", label: "Uc(V)" },
  { prop: "transformername", label: "Ia(A)" },
  { prop: "transformername", label: "Ib(A)" },
  { prop: "transformername", label: "Ic(A)" },
  { prop: "transformername", label: "P(kW)" },
  { prop: "transformername", label: "Q(kVar)" },
  { prop: "transformername", label: "Pf" }
];

const onSubmit = () => {
  console.log("submit!");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
