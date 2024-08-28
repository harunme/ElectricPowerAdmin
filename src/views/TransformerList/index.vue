<template>
  <div class="flex-column TransformerList">
    <StationContext :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox :width="412">
        <CirecleNumber label="高损耗运行" color="rgb(255, 86, 48)" :value="number.red" />
        <CirecleNumber label="正常运行" color="rgb(250, 175, 0)" :value="number.yellow" />
        <CirecleNumber label="经济运行" color="#00a76f" :value="number.green" />
        <div class="pie-box">
          <Pie :data="pieData" />
        </div>
      </CollapseBox>
      <div class="card table-box">
        <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="TransformerList">
import { ref } from "vue";
import { ReqPage } from "@/api/interface/index";
import { summary } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CirecleNumber from "@/components/Charts/components/CirecleNumber.vue";
import Pie from "@/components/Charts/components/Pie.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import { getContextStationId } from "@/utils";

const number = ref({ red: 0, yellow: 0, green: 0 });
const tableRef = ref<any>(null);

const pieData = ref([
  {
    value: 0,
    name: "高损耗运行",
    itemStyle: {
      color: "rgb(255, 86, 48)"
    }
  },
  {
    value: 0,
    name: "正常运行",
    itemStyle: {
      color: "rgb(250, 175, 0)"
    }
  },
  {
    value: 0,
    name: "经济运行",
    itemStyle: {
      color: "#1677ff"
    }
  }
]);

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "transformername", label: "变压器" },
  { prop: "voltagestep", label: "额定容量(kVA)", width: 120 },
  { prop: "p", label: "有功功率(kW)", width: 120 },
  { prop: "pf", label: "功率因数", width: 92 },
  { prop: "s", label: "视在功率(kVA)", width: 120 },
  { prop: "loadFactor", label: "负载率", width: 82 },
  {
    label: "温度(℃)",
    children: [
      { prop: "A", label: "A", width: 62 },
      { prop: "B", label: "B", width: 62 },
      { prop: "C", label: "C", width: 62 },
      { prop: "油浸", label: "油浸", width: 62 }
    ]
  }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      pageNum,
      pageSize,
      sortParam: "station_id",
      sortTag: "ASC"
    };
    if (getContextStationId()) {
      params.stationid = getContextStationId();
    }
    const { data } = await summary(params);
    number.value = {
      red: data.red,
      yellow: data.yellow,
      green: data.green
    };
    pieData.value[0].value = data.red;
    pieData.value[1].value = data.yellow;
    pieData.value[2].value = data.green;
    resolve(data.pageInfo);
  });
};

const onContextStationChange = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
