<template>
  <div class="flex-column">
    <StationContext :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <TransformerTree ref="transformerInfoTreeRef" :is-multiple="true" :on-change="onTransformerTreeChange" />
      </CollapseBox>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" type="month" :clearable="false" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onExport">导出</el-button>
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

<script setup lang="tsx" name="MonthlyTransTempReport_zx">
import { ref, reactive } from "vue";
import moment from "moment";
import { transformerTempMonthReport } from "@/api/modules/main";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import TransformerTree from "@/components/TransformerTree/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import { ElMessage } from "element-plus";
import { exportExcel } from "@/utils/exportExcel";

const tableRef = ref<any>(null);
const transformer = ref<any>([]);
const transformerInfoTreeRef = ref<any>(null);

const formInline = reactive<{
  starttime: string;
}>({
  starttime: moment().format("YYYY-MM")
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

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const fetchData = async (): Promise<any> => {
  if (transformer?.value?.length === 0) return ElMessage.info({ message: "请至少选择一个变压器" });
  columns.value = [];
  return new Promise(async resolve => {
    const { data }: any = await transformerTempMonthReport(
      transformer.value.map(({ stationid, transformerid }) => ({
        stationid,
        transformerid,
        starttime: moment(formInline.starttime).format("YYYY-MM")
      }))
    );
    if (!data) {
      return resolve({ list: [], total: 0 });
    }
    const { timeColumns, circuitUIPQPfEpis } = getData(data);

    columns.value = [...columns.value, ...timeColumns];
    resolve({ list: circuitUIPQPfEpis, total: 0 });
  });
};

const getData = data => {
  const circuitnames: any[] = [];
  const timeColumns = [] as any[];
  const timesMap: any = {};
  for (let index = 0; index < data.PowerValue.length; index++) {
    const time = moment(data.PowerValue[index].collecttime).format("MM-DD");

    if (!circuitnames.includes(data.PowerValue[index].circuitname)) {
      circuitnames.push(data.PowerValue[index].circuitname);
    }
    if (!timesMap[time]) {
      timesMap[time] = { prop: time, label: time };
      timeColumns.push(timesMap[time]);
    }
    // timeColumns.push({ prop: time, label: time });
  }

  const params = [
    { name: "A相", value: "fTempA" },
    { name: "B相", value: "fTempB" },
    { name: "C相", value: "fTempC" }
  ];
  const circuitUIPQPfEpis: any[] = [];

  let rowsIndex = 0;
  circuitnames.forEach(() => {
    params.forEach((param, i) => {
      circuitUIPQPfEpis[rowsIndex] = { paramsName: param.name };
      rowsIndex = rowsIndex + 1;
      for (let index = 0; index < data.PowerValue.length; index++) {
        const time = moment(data.PowerValue[index].collecttime).format("MM-DD");

        circuitUIPQPfEpis[i][time] = data.PowerValue[index][param.value];
        circuitUIPQPfEpis[i].stationname = data.PowerValue[index]["stationname"];
        circuitUIPQPfEpis[i].objectname = data.PowerValue[index]["objectname"];
        circuitUIPQPfEpis[i].temp = "温度(℃)";
      }
    });
  });

  return { timeColumns, circuitUIPQPfEpis };
};

const onExport = async () => {
  if (transformer.value.length === 0) return ElMessage.info({ message: "请至少选择一个变压器" });

  const { data }: any = await transformerTempMonthReport(
    transformer.value.map(({ stationid, transformerid }) => ({
      stationid,
      transformerid,
      starttime: moment(formInline.starttime).format("YYYY-MM")
    }))
  );

  const { circuitUIPQPfEpis } = getData(data);

  let textKeyMaps = [] as any;
  columns.value.forEach(({ label, prop }) => {
    textKeyMaps.push({ [label]: prop });
  });

  console.log("textKeyMaps", textKeyMaps);

  exportExcel({
    data: circuitUIPQPfEpis,
    textKeyMaps,
    filename: `${moment(formInline.starttime).format("YYYY-MM")}_变压器温度报表.xlsx`
  });
};

const onContextStationChange = async () => {
  transformerInfoTreeRef?.value?.resetData();
};

const onTransformerTreeChange = (transformerids: string[], transformers: any) => {
  if (transformerids.length === 0) return ElMessage.info({ message: "请至少选择一个变压器" });
  transformer.value = transformers;
  console.log("transformers", transformerids);
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
