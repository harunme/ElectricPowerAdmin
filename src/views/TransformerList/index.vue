<template>
  <div class="flex-column">
    <TransformerSelect :on-change="selectTransformer" />
    <div class="main-box">
      <div class="card left-box">
        <CirecleNumber label="高损耗运行" color="rgb(255, 86, 48)" :value="number.red" />
        <CirecleNumber label="正常运行" color="rgb(250, 175, 0)" :value="number.yellow" />
        <CirecleNumber label="经济运行" color="#00a76f" :value="number.green" />
        <div class="pie-box">
          <Pie :data="pieData" />
        </div>
      </div>
      <div class="card table-box">
        <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { ref } from "vue";
import { ReqPage } from "@/api/interface/index";
import { summary } from "@/api/modules/main";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CirecleNumber from "@/components/Charts/components/CirecleNumber.vue";
import Pie from "@/components/Charts/components/Pie.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import { localGet } from "@/utils";

const number = ref({ red: 0, yellow: 0, green: 0 });
const tableRef = ref<any>(null);
const stationId = ref(localGet("context-transformer")?.stationid);

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
  { prop: "voltagestep", label: "额定容量(kVA)" },
  { prop: "regionname", label: "有功功率(kW)" },
  { prop: "pf", label: "功率因数" },
  { prop: "s", label: "视在功率(kVA)" },
  { prop: "loadFactor", label: "负载率" },
  {
    label: "温度(℃)",
    children: [
      { prop: "xx", label: "A" },
      { prop: "2a", label: "B" },
      { prop: "3sdf", label: "C" },
      { prop: "gfg", label: "油浸" }
    ]
  }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await summary({
      pageNum,
      pageSize,
      stationid: stationId.value,
      sortParam: "station_id",
      sortTag: "ASC"
    });
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

const selectTransformer = t => {
  stationId.value = t.stationid;
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
