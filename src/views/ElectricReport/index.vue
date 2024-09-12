<template>
  <div class="ElectricReport flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card flex-column">
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
          <el-form-item label="时间间隔">
            <el-select v-model="formInline.timeinterval">
              <el-option label="一分钟" value="1" />
              <el-option label="五分钟" value="5" />
              <el-option label="十五分钟" value="15" />
              <el-option label="半小时" value="30" />
              <el-option label="一小时" value="60" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
              </el-button>
              <el-button type="primary" @click="clickNext">
                下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable
          ref="tableRef"
          :fetch-on-mounted="false"
          :span-method="objectSpanMethod"
          :columns="columns"
          :fetch-data="fetchData"
        >
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="ElectricReport">
import { ref, reactive } from "vue";
import moment from "moment";
import { ElectricReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import { ElMessage } from "element-plus";
import { getContextStationId } from "@/utils";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";

const tableRef = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);

const formInline = reactive<{
  starttime: string;
  timeinterval: string;
  voltageType: "all" | "pv" | "lv";
}>({
  timeinterval: "1",
  starttime: moment().format("YYYY-MM-DD"),
  voltageType: "all"
});

const AllColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "采集时间", width: 200 },
  { prop: "fEpi", label: "Epi(kWh)", width: 92 },
  { prop: "fUa", label: "Ua(V)" },
  { prop: "fUb", label: "Ub(V)" },
  { prop: "fUc", label: "Uc(V)" },
  { prop: "fUab", label: "Uab(V)" },
  { prop: "fUbc", label: "Ubc(V)" },
  { prop: "fUca", label: "Uca(V)" },
  { prop: "fIa", label: "Ia(A)" },
  { prop: "fIb", label: "Ib(A)" },
  { prop: "fIc", label: "Ic(A)" },
  { prop: "fP", label: "P(kW)" },
  { prop: "fQ", label: "Q(kVar)" },
  { prop: "fPF", label: "Pf" }
];

const PvColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "采集时间", width: 200 },
  { prop: "fEpi", label: "Epi(kWh)", width: 92 },
  { prop: "fUa", label: "Ua(V)" },
  { prop: "fUb", label: "Ub(V)" },
  { prop: "fUc", label: "Uc(V)" },
  { prop: "fIa", label: "Ia(A)" },
  { prop: "fIb", label: "Ib(A)" },
  { prop: "fIc", label: "Ic(A)" },
  { prop: "fP", label: "P(kW)" },
  { prop: "fQ", label: "Q(kVar)" },
  { prop: "fPF", label: "Pf" }
];

const LvColumns = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "collecttime", label: "采集时间", width: 200 },
  { prop: "fEpi", label: "Epi(kWh)", width: 92 },
  { prop: "fUab", label: "Uab(V)" },
  { prop: "fUbc", label: "Ubc(V)" },
  { prop: "fUca", label: "Uca(V)" },
  { prop: "fIa", label: "Ia(A)" },
  { prop: "fIb", label: "Ib(A)" },
  { prop: "fIc", label: "Ic(A)" },
  { prop: "fP", label: "P(kW)" },
  { prop: "fQ", label: "Q(kVar)" },
  { prop: "fPF", label: "Pf" }
];

const columns = ref(AllColumns);

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

const clickPrev = () => {
  formInline.starttime = moment(formInline.starttime).subtract(1, "d").format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const clickNext = () => {
  formInline.starttime = moment(formInline.starttime).add(1, "d").format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const changeStartTime = value => {
  formInline.starttime = moment(value).format("YYYY-MM-DD");
  tableRef?.value?.resetData();
};

const changeVoltageType = value => {
  console.log("changeVoltageType", value);
  if (value === "pv") {
    columns.value = PvColumns;
  }
  if (value === "lv") {
    columns.value = LvColumns;
  }
  if (value === "all") {
    columns.value = AllColumns;
  }
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: getContextStationId(),
      circuitid: circuit.value,
      starttime: formInline.starttime,
      timeinterval: formInline.timeinterval
    };
    const { data } = await ElectricReport(params);
    const list = data?.PowerValue || [];

    resolve({ list, total: 0 });
  });
};

const onContextStationChange = () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  if (circuitids.length === 0) return ElMessage.info({ message: "请至少选择一个回路" });
  circuit.value = circuitids.join("-");
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
