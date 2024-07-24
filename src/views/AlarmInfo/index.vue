<template>
  <div class="flex-column AlarmInfo">
    <div class="main-box">
      <div class="card left-box">
        <el-tabs type="card" class="tabs" stretch>
          <el-tab-pane label="全部报警"> </el-tab-pane>
          <el-tab-pane label="未处理报警"> </el-tab-pane>
        </el-tabs>
      </div>
      <div class="card flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme">
              <el-option label="月报" value="M" />
              <el-option label="年报" value="Y" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.starttime" :type="formInline.scheme === 'M' ? 'month' : 'year'" />
          </el-form-item>
          <el-form-item>
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <div class="table-box">
          <el-tabs type="card" class="tabs">
            <el-tab-pane label="全部"> </el-tab-pane>
            <el-tab-pane label="普通"> </el-tab-pane>
            <el-tab-pane label="严重"> </el-tab-pane>
            <el-tab-pane label="事故"> </el-tab-pane>
          </el-tabs>
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmInfo">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface/index";
import { summary } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import { localGet } from "@/utils";

const number = ref({ red: 0, yellow: 0, green: 0 });
const tableRef = ref<any>(null);
const stationId = ref(localGet("context-transformer")?.stationid);

const formInline = reactive<{
  scheme: "M" | "Y";
  starttime: string;
}>({
  scheme: "M",
  starttime: moment().format("YYYY-MM")
});

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
  { prop: "transformername", label: "设备名称" },
  { prop: "voltagestep", label: "报警类型分类" },
  { prop: "regionname", label: "事件类型" },
  { prop: "pf", label: "发生时间" },
  { prop: "s", label: "报警描述" },
  { prop: "loadFactor", label: "报警等级" },
  { prop: "loadFactor", label: "确认状态" },
  { prop: "loadFactor", label: "详情" },
  { prop: "loadFactor", label: "操作" }
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
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
