<template>
  <div class="flex-column ConsumeEnergyReport">
    <TransformerSelect />
    <div class="main-box">
      <CollapseBox />
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="formInline.date"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="电能类别">
            <el-select v-model="formInline.energyKind">
              <el-option label="正向有功总电能" value="EPI" />
              <el-option label="反向有功总电能" value="EPE" />
              <el-option label="组合有功电能" value="ZHEPI" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button>导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable ref="tableRef" :span-method="objectSpanMethod" :columns="columns" :fetch-data="fetchData">
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { ref, reactive } from "vue";
import moment from "moment";
import PaginationTable, { SpanMethodProps } from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import { ConsumeEnergyReport } from "@/api/modules/main";

const tableRef = ref<any>(null);

const formInline = reactive({
  date: ["2024-06-01 00:15:00", "2024-06-01 00:20:00"],
  energyKind: "EPI" as "EPI" | "EPE" | "ZHEPI"
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const columns = [
  { prop: "circuitname", label: "回路名称 / kW·h" },
  { prop: "startvalue", label: "起始数值" },
  { prop: "endvalue", label: "截止数值" },
  { prop: "diffvalue", label: "差值" }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const starttime = moment(formInline.date[0]).format("YYYY-MM-DD HH:mm:ss");
    const endtime = moment(formInline.date[1]).format("YYYY-MM-DD HH:mm:ss");
    const params: any = {
      stationid: "000",
      circuitids: "000-001",
      starttime,
      endtime
      // energyKind: formInline.energyKind
    };
    if (formInline.energyKind !== "EPI") {
      params.energyKind = formInline.energyKind;
    }
    const { data } = await ConsumeEnergyReport(params);
    if (data === null) {
      resolve({ list: [] });
    } else {
      resolve({ list: data.PowerValue });
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
