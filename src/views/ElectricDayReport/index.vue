<template>
  <div class="flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree
          ref="circuitInfoTreeRef"
          :show-cascade="true"
          :show-all="true"
          :is-multiple="true"
          :on-change="onCircuitInfoTreeChange"
        />
      </CollapseBox>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="date" @change="changeStartTime" />
          </el-form-item>
          <el-form-item label="电压类别">
            <el-select v-model="formInline.voltageType">
              <el-option label="全部" value="all" />
              <el-option label="相电压" value="pv" />
              <el-option label="线电压" value="lv" />
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
          <!-- <el-form-item>
            <el-button>导出</el-button>
          </el-form-item> -->
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

<script setup lang="tsx" name="ElectricDayReport">
import { ref, reactive } from "vue";
import moment from "moment";
import { ElectricReportNew } from "@/api/modules/main";
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
  voltageType: "all" | "pv" | "lv";
}>({
  starttime: moment().format("YYYY-MM-DD"),
  voltageType: "all"
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

const columns = ref([
  { prop: "fCircuitname", label: "回路名称" },
  { prop: "paramsName", label: "参数名称" }
]);

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

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data }: any = await ElectricReportNew({
      stationid: getContextStationId(),
      circuitid: circuit.value,
      starttime: formInline.starttime
    });
    const lineParams = [
      { name: "A相电压(V)", value: "fUa" },
      { name: "B相电压(V)", value: "fUb" },
      { name: "C相电压(V)", value: "fUc" }
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

    if (!data) return resolve({ list: [] });
    const circuitnames: any[] = [];

    for (let index = 0; index < data.PowerValue.length; index++) {
      if (!circuitnames.includes(data.PowerValue[index].circuitname)) {
        circuitnames.push(data.PowerValue[index].circuitname);
      }
    }

    const circuitUIPQPfEpis: any[] = [];
    const timeColumns = [] as any[];
    let rowsIndex = 0;
    circuitnames.forEach(() => {
      [...lineParams, ...otherParams].forEach((param, i) => {
        circuitUIPQPfEpis[rowsIndex] = { paramsName: param.name };
        rowsIndex = rowsIndex + 1;
        for (let index = 0; index < data.PowerValue.length; index++) {
          const time = moment(data.PowerValue[index].collecttime).format("HH");
          timeColumns.push({ prop: time, label: `${time}时` });
          circuitUIPQPfEpis[i][time] = data.PowerValue[index][param.value];
          circuitUIPQPfEpis[i].fCircuitname = data.PowerValue[index]["circuitname"];
        }
      });
    });
    columns.value = [...columns.value, ...timeColumns];
    resolve({ list: circuitUIPQPfEpis });
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
