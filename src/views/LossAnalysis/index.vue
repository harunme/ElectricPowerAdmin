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
        <PaginationTable ref="tableRef" row-key="circuitid" :columns="columns" :fetch-data="fetchData">
          <template #actions="">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="LossAnalysis">
import { reactive, ref } from "vue";
import { EnergyLineLoss2Tree } from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import moment from "moment";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
const tableRef = ref<any>(null);
const formInline = reactive({
  date: [start, end]
});

const size = ref<"default" | "large" | "small">("default");

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const columns: any = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "value", label: "当前支路能耗" },
  { prop: "subvalue", label: "下级支路能耗合计" },
  { prop: "diffvalue", label: "当前支路和下级支路能耗合计的差值" },
  { prop: "percent", label: "差值百分比" }
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
      starttime: moment(formInline.date[0]).format("YYYY-MM-DD HH:mm:ss"),
      endtime: moment(formInline.date[1]).format("YYYY-MM-DD HH:mm:ss")
    });
    console.log("fetchData", data.LineLossData);
    function getPartialData(data, fields) {
      // 创建一个新的空对象来存储结果
      let result = {};
      // 遍历每个需要保留的字段
      for (let field of fields) {
        // 如果当前数据对象有这个字段，那么就把它添加到结果对象中
        if (data.hasOwnProperty(field)) {
          result[field] = data[field];
        }
      }
      // 如果当前数据对象有children字段，并且它是一个数组
      if (data.hasOwnProperty("children") && Array.isArray(data["children"])) {
        // 那么就对每个子对象进行相同的处理，并把结果添加到结果对象的children字段中
        result["children"] = data["children"].map(child => getPartialData(child, fields));
      }
      // 返回结果对象
      return result;
    }
    resolve({
      list: data.LineLossData.map(item =>
        getPartialData(item, ["circuitid", "circuitname", "value", "subvalue", "diffvalue", "percent"])
      )
    });
  });
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
