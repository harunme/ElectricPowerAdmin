<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="date" @change="changeStartTime" />
          </el-form-item>
          <el-form-item label="电压类别">
            <el-select v-model="formInline.voltageType" @change="changeVoltageType">
              <el-option label="全部" value="all" />
              <el-option label="相电压" value="pv" />
              <el-option label="线电压" value="lv" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button type="primary" @click="clickNext">
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable
          ref="tableRef"
          v-loading="loading"
          :span-method="objectSpanMethod"
          :columns="columns"
          :fetch-data="fetchData"
        >
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="ElectricDayReport">
import { ref, reactive } from "vue";
import moment from "moment";
import { ElectricMonthReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
// import data from "./data.json";

const tableRef = ref<any>(null);
const params = ref<any>([]);

const formInline = reactive<{
  starttime: string;
  voltageType: "all" | "pv" | "lv";
}>({
  starttime: "2024-06",
  voltageType: "all"
});

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % params.value.length === 0) {
      return {
        rowspan: params.value.length,
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

const columns = ref([
  { prop: "fCircuitname", label: "回路名称", width: 200 },
  { prop: "paramsName", label: "参数名称", width: 200 }
]);

const loading = ref(true);

const clickPrev = () => {
  formInline.starttime = moment(formInline.starttime).subtract(1, "M").format("YYYY-MM");
  tableRef?.value?.resetData();
};

const clickNext = () => {
  formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  tableRef?.value?.resetData();
};

const changeStartTime = value => {
  formInline.starttime = moment(value).format("YYYY-MM");
  tableRef?.value?.resetData();
};

const changeVoltageType = () => {
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    loading.value = true;
    const { data }: any = await ElectricMonthReport({
      stationid: "000",
      circuitid: "000",
      starttime: formInline.starttime
    });
    const circuitnames: any[] = [];
    for (let index = 0; index < data.PowerValue.length; index++) {
      if (!circuitnames.includes(data.PowerValue[index].circuitname)) {
        circuitnames.push(data.PowerValue[index].circuitname);
      }
    }

    const lineParams = [
      { name: "A相电压(V)", value: "fUa" },
      { name: "B相电压(V)", value: "fUb" },
      { name: "C相电压(V)", value: "fUc" }
    ];
    const phaseParams = [
      { name: "AB线电压(V)", value: "fUab" },
      { name: "BC线电压(V)", value: "fUbc" },
      { name: "CA线电压(V)", value: "fUca" }
    ];
    const otherParams = [
      { name: "A相电流(A)", value: "fIa" },
      { name: "B相电流(A)", value: "fIb" },
      { name: "C相电流(A)", value: "fIc" },
      { name: "总有功功率(kW)", value: "fP" },
      { name: "总无功功率(kVar)", value: "fQ" },
      { name: "总视在功率(kVA)", value: "fS" },
      { name: "总功率因数", value: "fPF" },
      { name: "有功电能（kW·h)", value: "fEpi" }
    ];

    if (formInline.voltageType === "all") {
      params.value = [...lineParams, ...phaseParams, ...otherParams];
    }
    if (formInline.voltageType === "lv") {
      params.value = [...lineParams, ...otherParams];
    }
    if (formInline.voltageType === "pv") {
      params.value = [...phaseParams, ...otherParams];
    }

    const circuitUIPQPfEpis: any[] = [];
    const timeColumns = [] as any[];
    let rowsIndex = 0;
    circuitnames.forEach(() => {
      params.value.forEach((param, i) => {
        circuitUIPQPfEpis[rowsIndex] = { paramsName: param.name };
        rowsIndex = rowsIndex + 1;
        for (let index = 0; index < data.PowerValue.length; index++) {
          const time = moment(data.PowerValue[index].collecttime).format("MM-DD");
          timeColumns.push({ prop: time, label: time });
          circuitUIPQPfEpis[i][time] = data.PowerValue[index][param.value];
          circuitUIPQPfEpis[i].fCircuitname = data.PowerValue[index]["circuitname"];
        }
      });
    });
    columns.value = [...columns.value, ...timeColumns];
    loading.value = false;
    resolve({ list: circuitUIPQPfEpis, total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
