<template>
  <div class="flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme">
              <el-option label="日报" value="day" />
              <el-option label="月报" value="month" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formInline.scheme !== 'custom'" label="日期">
            <el-date-picker
              v-if="formInline.scheme === 'day'"
              @change="changeStartTime"
              v-model="formInline.starttime"
              type="date"
            />
            <el-date-picker
              v-if="formInline.scheme === 'month'"
              @change="changeStartTime"
              v-model="formInline.starttime"
              type="month"
            />
          </el-form-item>
          <el-form-item v-else label="日期">
            <el-date-picker v-model="formInline.daterange" @change="changeDaterange" type="daterange" />
          </el-form-item>
          <el-form-item label="电力类别">
            <el-select v-model="formInline.param">
              <el-option label="功率" value="P" />
              <el-option label="电流" value="I" />
              <el-option label="相电压" value="U" />
              <el-option label="线电压" value="ABCU" />
              <el-option label="不平衡度" value="UnB" />
              <el-option label="电压谐波" value="UHR" />
              <el-option label="电流谐波" value="IHR" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group v-if="formInline.scheme === 'month'" type="primary">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button @click="clickNext">
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <el-button-group v-if="formInline.scheme === 'day'" type="primary">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
              </el-button>
              <el-button @click="clickNext">
                下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable ref="tableRef" :columns="columns[formInline.param]" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { ref, reactive } from "vue";
import moment from "moment";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import { ElecMaxMinAvgValue } from "@/api/modules/main";
import { columns } from "./config";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

const tableRef = ref<any>(null);

const formInline = reactive<{
  param: "I" | "U" | "ABCU" | "P" | "UnB" | "UHR" | "IHR";
  scheme: "day" | "month" | "custom";
  starttime: string;
  daterange: any;
}>({
  param: "I",
  scheme: "day",
  starttime: "2024-06-01",
  daterange: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const changeStartTime = value => {
  if (formInline.scheme === "day") formInline.starttime = moment(value).format("YYYY-MM-DD");
  if (formInline.scheme === "month") formInline.starttime = moment(value).format("YYYY-MM");
};

const changeDaterange = value => {
  console.log("changeDaterange", value);
};

const clickPrev = () => {
  if (formInline.scheme === "month") formInline.starttime = moment(formInline.starttime).subtract(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).subtract(1, "d").format("YYYY-MM-DD");
};

const clickNext = () => {
  if (formInline.scheme === "month") formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).add(1, "d").format("YYYY-MM-DD");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      stationid: "000",
      circuitids: "000-001-002",
      scheme: formInline.scheme,
      starttime: formInline.starttime,
      param: formInline.param === "ABCU" ? "U" : formInline.param
    };
    if (formInline.scheme === "custom") {
      params.starttime = moment(formInline.daterange[0]).format("YYYY-MM-DD");
      params.endtime = moment(formInline.daterange[1]).format("YYYY-MM-DD");
    } else {
      params.starttime = formInline.starttime;
    }
    const { data } = await ElecMaxMinAvgValue(params);
    const list = data?.StatisticValue || [];
    resolve({ list, total: 0 });
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
