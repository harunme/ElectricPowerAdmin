<template>
  <div class="EnergyData flex-column">
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
          <el-tab-pane label="日报" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker
                  style=" width: 120px;margin-right: 4px"
                  v-model="dayForm.date"
                  type="date"
                  placeholder="Pick a month"
                />
                <el-select v-model="dayForm.startTime" style=" width: 70px;margin-right: 4px">
                  <el-option
                    v-for="item in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <span style="color: var(--el-text-color-regular)">时 -</span>
                <el-select v-model="dayForm.endTime" style=" width: 70px;margin: 0 4px">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <span style="color: var(--el-text-color-regular)">时</span>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button>
                    <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一时
                  </el-button>
                  <el-button>
                    下一时<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">图表</el-button>
                <el-button type="primary">饼图</el-button>
                <el-button type="primary">导出</el-button>
                <div style="margin-left: 8px; color: var(--el-text-color-regular)">(*为进线回路)</div>
              </el-form-item>
            </el-form>
            <PaginationTable :summary-method="getSummaries" show-summary :columns="dayColumns" :fetch-data="fetchData">
            </PaginationTable>
          </el-tab-pane>
          <el-tab-pane label="月报" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker
                  style=" width: 120px;margin-right: 4px"
                  v-model="dayForm.date"
                  type="date"
                  placeholder="Pick a month"
                />
                <el-select v-model="dayForm.startTime" style=" width: 70px;margin-right: 4px">
                  <el-option
                    v-for="item in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <span style="color: var(--el-text-color-regular)">日 -</span>
                <el-select v-model="dayForm.endTime" style=" width: 70px;margin: 0 4px">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <span style="color: var(--el-text-color-regular)">日</span>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button>
                    <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
                  </el-button>
                  <el-button>
                    下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">图表</el-button>
                <el-button type="primary">饼图</el-button>
                <el-button type="primary">导出</el-button>
                <div style="margin-left: 8px; color: var(--el-text-color-regular)">(*为进线回路)</div>
              </el-form-item>
            </el-form>
            <PaginationTable :columns="monthColumns" :fetch-data="fetchData"> </PaginationTable>
          </el-tab-pane>
          <el-tab-pane label="年报" class="table-box">
            <el-form :inline="true" :model="formInline" class="table-form-inline">
              <el-form-item label="时间范围">
                <el-date-picker
                  style=" width: 120px;margin-right: 4px"
                  v-model="dayForm.date"
                  type="date"
                  placeholder="Pick a month"
                />
                <el-select v-model="dayForm.startTime" style=" width: 70px;margin-right: 4px">
                  <el-option v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="item" :label="item" :value="item" />
                </el-select>
                <span style="color: var(--el-text-color-regular)">月 -</span>
                <el-select v-model="dayForm.endTime" style=" width: 70px;margin: 0 4px">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <span style="color: var(--el-text-color-regular)">月</span>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button>
                    <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
                  </el-button>
                  <el-button>
                    下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary">图表</el-button>
                <el-button type="primary">饼图</el-button>
                <el-button type="primary">导出</el-button>
                <div style="margin-left: 8px; color: var(--el-text-color-regular)">(*为进线回路)</div>
              </el-form-item>
            </el-form>
            <PaginationTable :columns="yearColumns" :fetch-data="fetchData"> </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="bing">
import { onMounted, ref, reactive, h } from "vue";
import type { VNode } from "vue";
import type { TableColumnCtx } from "element-plus";
import { getCircuitInfoTree } from "@/api/modules/sys";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tree = ref([] as any);
const props = { children: "children", label: "circuitname" };

const dayColumns = [
  { prop: "stationname", label: "回路名称 / kW·h" },
  { prop: "transformername", label: "00时" },
  { prop: "transformername", label: "01时" },
  { prop: "transformername", label: "02时" },
  { prop: "transformername", label: "03时" },
  { prop: "transformername", label: "合计" }
];

const monthColumns = [
  { prop: "stationname", label: "回路名称 / kW·h" },
  { prop: "transformername", label: "00日" },
  { prop: "transformername", label: "01日" },
  { prop: "transformername", label: "02日" },
  { prop: "transformername", label: "03日" },
  { prop: "transformername", label: "合计" }
];

const yearColumns = [
  { prop: "stationname", label: "回路名称 / kW·h" },
  { prop: "transformername", label: "00月" },
  { prop: "transformername", label: "01月" },
  { prop: "transformername", label: "02月" },
  { prop: "transformername", label: "03月" },
  { prop: "transformername", label: "合计" }
];

interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: (string | VNode)[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h("div", { style: { textDecoration: "underline" } }, ["Total Cost"]);
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}`;
    } else {
      sums[index] = "N/A";
    }
  });

  return sums;
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    resolve({ list: [], totle: 0 });
  });
};

onMounted(async () => {
  const res = await getCircuitInfoTree();
  tree.value = res?.data;
});

const dayForm = reactive({
  date: "2024-06-30",
  startTime: "0",
  endTime: "23"
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
