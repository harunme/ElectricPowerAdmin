<template>
  <div class="LossAnalysis">
    <TransformerSelect />
    <div class="card content">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            :size="size"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable :columns="columns" :fetch-data="fetchData">
          <template #actions="">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="MonitoringLoop">
import { reactive, ref } from "vue";
// import { ReqPage } from "@/api/interface";
import { EnergyLineLoss2Tree } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

const size = ref<"default" | "large" | "small">("default");

const onSubmit = () => {
  console.log("submit!");
};

const columns: any = [
  { prop: "stationname", label: "回路名称" },
  { prop: "stationid", label: "当前支路能耗" },
  { prop: "voltagestep", label: "下级支路能耗合计" },
  { prop: "voltagestep", label: "当前支路和下级支路能耗合计的差值" },
  { prop: "voltagestep", label: "差值百分比" }
];

const shortcuts = [
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await EnergyLineLoss2Tree({
      stationid: "000",
      starttime: "2024-06-01 01:00:00",
      endtime: "2024-06-02 00:00:00"
    });
    // console.log("fetchData", data.list);
    resolve({ list: data.LineLossData });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
