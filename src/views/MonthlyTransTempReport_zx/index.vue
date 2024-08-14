<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <CollapseBox />
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="month" @change="changeStartTime" />
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
import { transformerTempMonthReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";

const tableRef = ref<any>(null);

const formInline = reactive<{
  starttime: string;
}>({
  starttime: "2024-06"
});

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    if (rowIndex % 3 === 0) {
      return {
        rowspan: 3,
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
  { prop: "stationname", label: "站点名称", width: 200 },
  { prop: "objectname", label: "变压器名称", width: 200 },
  { prop: "temp", label: "温度" },
  { prop: "paramsName", label: "" }
]);

const loading = ref(true);

const changeStartTime = value => {
  formInline.starttime = moment(value).format("YYYY-MM");
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    loading.value = true;
    const { data }: any = await transformerTempMonthReport([
      {
        stationid: "000",
        transformerid: "0",
        starttime: formInline.starttime
      }
    ]);
    if (data === null) {
      loading.value = false;
      resolve({ list: [], total: 0 });
    }
    const circuitnames: any[] = [];
    for (let index = 0; index < data.PowerValue.length; index++) {
      if (!circuitnames.includes(data.PowerValue[index].circuitname)) {
        circuitnames.push(data.PowerValue[index].circuitname);
      }
    }

    const params = [
      { name: "A相", value: "fTempA" },
      { name: "B相", value: "fTempB" },
      { name: "C相", value: "fTempC" }
    ];

    const circuitUIPQPfEpis: any[] = [];
    const timeColumns = [] as any[];
    let rowsIndex = 0;
    circuitnames.forEach(() => {
      params.forEach((param, i) => {
        circuitUIPQPfEpis[rowsIndex] = { paramsName: param.name };
        rowsIndex = rowsIndex + 1;
        for (let index = 0; index < data.PowerValue.length; index++) {
          const time = moment(data.PowerValue[index].collecttime).format("MM-DD");
          timeColumns.push({ prop: time, label: time });
          circuitUIPQPfEpis[i][time] = data.PowerValue[index][param.value];
          circuitUIPQPfEpis[i].stationname = data.PowerValue[index]["stationname"];
          circuitUIPQPfEpis[i].objectname = data.PowerValue[index]["objectname"];
          circuitUIPQPfEpis[i].temp = "温度(℃)";
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
@import "./index";
</style>
