<template>
  <div class="PushRecord">
    <div class="card flex-column">
      <el-form :inline="true" :model="formInline" class="table-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.metername" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formInline.metername" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="推送类型" prop="statedes">
          <el-select v-model="formInline.statedes">
            <el-option label="全部" value="全部" />
            <el-option label="通知" value="通知" />
            <el-option label="消息" value="消息" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标类型" prop="statedes">
          <el-select v-model="formInline.statedes">
            <el-option label="全部" value="全部" />
            <el-option label="Android" value="Android" />
            <el-option label="IOS" value="IOS" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送时间" prop="date">
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
        </el-form-item>
      </el-form>
      <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="PushRecord">
import { ref, reactive } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface";
import { OverLimitEvent } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tableRef = ref<any>(null);

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);

const formInline = reactive({
  statedes: "全部",
  metername: "",
  paramname: "",
  date: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const columns = [
  { prop: "stationname", label: "记录ID", width: 82 },
  { prop: "alarmtime", label: "推送类型", width: 200 },
  { prop: "voltagestep", label: "目标类型", width: 200 },
  { prop: "metername", label: "目标值", width: 180 },
  { prop: "paramname", label: "标题" },
  { prop: "statefloat", label: "内容" },
  { prop: "statefloat", label: "推送时间", width: 200 },
  { prop: "statefloat", label: "用户名", width: 200 }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const starttime = moment(formInline.date[0]).format("YYYY-MM-DD");
  const endtime = moment(formInline.date[1]).format("YYYY-MM-DD");
  const statedes = formInline.statedes;
  const metername = formInline.metername;
  const paramname = formInline.paramname;
  return new Promise(async resolve => {
    const { data } = await OverLimitEvent({
      pageNum,
      pageSize,
      starttime,
      endtime,
      metername,
      statedes,
      paramname
    });
    if (!data) {
      resolve({ list: [] });
    } else {
      resolve(data);
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
