<template>
  <div class="SMSLog">
    <TransformerSelect />
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline" class="table-form-inline">
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
        <el-form-item label="发送结果" prop="eventtype">
          <el-select v-model="formInline.eventtype">
            <el-option label="全部" value="全部" />
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.metername" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="SMSLog">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { GetAlarmEventYcList } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive({
  eventtype: "全部",
  metername: "",
  paramname: "",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const columns = [
  { prop: "stationname", label: "变配电站名称", width: 300 },
  { prop: "alarmtime", label: "发送时间", width: 200 },
  { prop: "voltagestep", label: "手机号", width: 120 },
  { prop: "metername", label: "发送结果", width: 180 },
  { prop: "paramname", label: "发送内容" },
  { prop: "statefloat", label: "回复信息" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const eventtype = formInline.eventtype;
  const metername = formInline.metername;
  const paramname = formInline.paramname;
  return new Promise(async resolve => {
    const { data } = await GetAlarmEventYcList({
      pageNum,
      pageSize,
      starttime,
      endtime,
      metername,
      eventtype,
      paramname
    });
    console.log("fetchData", data.list);
    resolve(data);
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
