<template>
  <div class="EnergyReportOfCollection">
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="关键字">
          <el-input style="width: 320px" v-model="formInline.keyword" placeholder="请输入变配电站名称或用户名"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="date">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyReportOfCollection">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { GetLogPageInfo } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive({
  keyword: "",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onExport = () => {
  console.log("onExport");
};

const columns = [
  { prop: "accountid", label: "用户名" },
  { prop: "stationname", label: "变配电站名称" },
  { prop: "destext", label: "用户IP" },
  { prop: "logintime", label: "时间" },
  { prop: "useaddress", label: "用户地址" },
  { prop: "voltagestep", label: "操作内容" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const keyword = formInline.keyword;

  return new Promise(async resolve => {
    const { data } = await GetLogPageInfo({
      pageNum,
      pageSize,
      starttime,
      endtime,
      keyword
    });
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
