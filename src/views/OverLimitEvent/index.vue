<template>
  <div class="OverLimitEvent">
    <TransformerSelect />
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline">
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
        <el-form-item label="事件类型" prop="eventtype">
          <el-select v-model="formInline.eventtype">
            <el-option label="全部" value="全部" />
            <el-option label="网关离线" value="网关离线" />
            <el-option label="仪表离线" value="仪表离线" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="formInline.meterid" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onSubmit">导出</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="OverLimitEvent">
import { reactive } from "vue";
import { ReqPage } from "@/api/interface";
import { GetAlarmEventYcList } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive({
  user: "",
  region: "",
  date: [start, end]
});

const onSubmit = () => {
  console.log("submit!");
};

const columns = [
  { prop: "stationname", label: "变配电站名称", width: 300 },
  { prop: "alarmtime", label: "开始时间", width: 200 },
  { prop: "voltagestep", label: "报警类型", width: 120 },
  { prop: "metername", label: "仪表名称", width: 180 },
  { prop: "paramname", label: "参数名称", width: 180 },
  { prop: "statefloat", label: "报警值", width: 180 },
  { prop: "limitvalue", label: "限定值", width: 180 },
  { prop: "eventdescription", label: "详情" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await GetAlarmEventYcList({
      pageNum,
      pageSize,
      starttime: "2024-06-01",
      endtime: "2024-06-23"
    });
    console.log("fetchData", data.list);
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
