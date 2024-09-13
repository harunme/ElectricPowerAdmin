<template>
  <div class="EnergyReportOfCollection">
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="formInline.range"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
          <span>（单位：kW·h）</span>
        </el-form-item>
      </el-form>
      <PaginationTable show-summary ref="tableRef" :columns="columns" :fetch-data="fetchData" :summary-method="getSummaries">
      </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyReportOfCollection">
import { reactive, ref, h } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { EnergyReportNoHjPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import { exportExcel } from "@/utils/exportExcel";

const tableRef = ref<any>(null);
const columns = ref<any>([]);

const formInline = reactive({
  range: [moment().startOf("month").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
});

const getSummaries = (param: any) => {
  const { columns, data } = param;
  const sums: any[] = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h("div", { style: { fontWeight: "bolder" } }, ["合计"]);
      return;
    }
    if (index === 1) {
      sums[index] = h("div", { style: {} }, ["-"]);
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    sums[index] = `${values.reduce((prev, curr) => {
      const value = Number(curr);
      if (!Number.isNaN(value)) {
        return prev + curr;
      } else {
        return prev;
      }
    }, 0)}`;
  });

  return sums;
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onExport = async () => {
  const params = {
    pageNum: 1,
    pageSize: 99999,
    startTime: moment(formInline.range[0]).format("YYYY-MM-DD"),
    endTime: moment(formInline.range[1]).format("YYYY-MM-DD")
  };
  const { data } = await EnergyReportNoHjPageInfo(params);
  const station = {} as any;
  const textKeyMaps = [] as any;
  const totalRow = { stationname: "合计", stationid: "-" } as any;
  data?.list.forEach(({ stationname, stationid, date, value }) => {
    if (totalRow[moment(date).format("MM-DD")]) {
      totalRow[moment(date).format("MM-DD")] += value;
    } else {
      totalRow[moment(date).format("MM-DD")] = value;
    }
    if (totalRow["total"]) {
      totalRow["total"] += value;
    } else {
      totalRow["total"] = value;
    }
    if (station[stationname]) {
      station[stationname].total += value;
    } else {
      station[stationname] = {};
      station[stationname].stationid = stationid;
      station[stationname].stationname = stationname;
      station[stationname].total = value;

      textKeyMaps.push({ 变配电站名称: "stationname" });
      textKeyMaps.push({ 变配电站编号: "stationid" });
    }
    station[stationname][moment(date).format("MM-DD")] = value;
    textKeyMaps.push({ [moment(date).format("MM-DD")]: moment(date).format("MM-DD") });
  });
  textKeyMaps.push({ 合计: "total" });
  const list = Object.keys(station).map(key => station[key]);
  list.push(totalRow);
  exportExcel({
    data: list,
    textKeyMaps,
    filename: `${params.startTime}_${params.endTime}_用能月报.xlsx`
  });
};

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await EnergyReportNoHjPageInfo({
      pageNum,
      pageSize,
      startTime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endTime: moment(formInline.range[1]).format("YYYY-MM-DD")
    });
    const station = {} as any;
    const cols = [] as any;
    data?.list.forEach(({ stationname, stationid, date, value }) => {
      if (station[stationname]) {
        station[stationname].total += value;
      } else {
        station[stationname] = {};
        station[stationname].stationid = stationid;
        station[stationname].stationname = stationname;
        station[stationname].total = value;
        cols.push({ prop: "stationname", label: "变配电站名称" });
        cols.push({ prop: "stationid", label: "变配电站编号" });
      }
      station[stationname][moment(date).format("MM-DD")] = value;
      cols.push({ prop: moment(date).format("MM-DD"), label: moment(date).format("MM-DD") });
    });
    cols.push({ prop: "total", label: "合计" });
    columns.value = cols;
    const list = Object.keys(station).map(key => station[key]);
    resolve({ list: list || [] });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
