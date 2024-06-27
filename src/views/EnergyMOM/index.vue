<template>
  <div class="EnergyMOM flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box">
        <el-tree
          default-expand-all
          style="max-width: 600px"
          :data="tree"
          show-checkbox
          node-key="regionid"
          :default-checked-keys="[100]"
          :props="props"
        />
      </div>
      <div class="card content-box">
        <el-tabs>
          <el-tab-pane label="按日" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable :columns="dayColumns" :fetch-data="fetchData"> </PaginationTable>
          </el-tab-pane>
          <el-tab-pane label="按周" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable :columns="weekColumns" :fetch-data="fetchData"> </PaginationTable>
          </el-tab-pane>
          <el-tab-pane label="按月" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a month" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">导出</el-button>
              </el-form-item>
            </el-form>
            <PaginationTable :columns="monthColumns" :fetch-data="fetchData">
              <template #actions="">
                <el-button type="primary" size="small">图表</el-button>
              </template>
            </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { onMounted, ref, reactive } from "vue";
import { getCircuitInfoTree } from "@/api/modules/sys";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tree = ref([] as any);
const props = { children: "children", label: "circuitname" };

const dayColumns = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "当日用电 / kW·h" },
  { prop: "transformername", label: "上日用电 / kW·h" },
  { prop: "transformername", label: "增加值" },
  { prop: "transformername", label: "环比(%)" },
  { prop: "actions", label: "操作", width: "80px" }
];

const weekColumns = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "当周用电 / kW·h" },
  { prop: "transformername", label: "上周用电 / kW·h" },
  { prop: "transformername", label: "增加值" },
  { prop: "transformername", label: "环比(%)" },
  { prop: "actions", label: "操作", width: "80px" }
];

const monthColumns = [
  { prop: "stationname", label: "回路名称" },
  { prop: "transformername", label: "当月用电 / kW·h" },
  { prop: "transformername", label: "上月用电 / kW·h" },
  { prop: "transformername", label: "增加值" },
  { prop: "transformername", label: "环比(%)" },
  { prop: "actions", label: "操作", width: "80px" }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], totle: 0 });
  });
};

onMounted(async () => {
  const res = await getCircuitInfoTree();
  tree.value = res?.data;
});

const formInline = reactive({
  user: "",
  region: "shanghai",
  date: ""
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
