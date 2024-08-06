<template>
  <div class="PaginationTable">
    <el-table
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :show-summary="showSummary"
      @selection-change="selectionChange"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column v-if="tableData.length !== 0 && selectionChange" type="selection" width="55"></el-table-column>
      <recursive-columns v-for="(item, index) in columns" :key="index" :column="item">
        <template v-for="slotName in Object.keys(slots)" #[slotName]="{ row }">
          <slot :name="slotName" :row="row"></slot>
        </template>
      </recursive-columns>
    </el-table>
    <el-pagination
      v-if="total > 0"
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="tsx">
import type { VNode } from "vue";
import { ref, onMounted, defineExpose, useSlots } from "vue";
// import { ReqPage, ResPage } from "@/api/interface/index";
import RecursiveColumns from "./RecursiveColumns.vue";
import type { TableColumnCtx } from "element-plus";

const slots = useSlots();

console.log(" $slots", slots.value);

export interface SpanMethodProps {
  row: any;
  column: TableColumnCtx<any>;
  rowIndex: number;
  columnIndex: number;
}

interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const props = defineProps<{
  summaryMethod?: (param: SummaryMethodProps) => (string | VNode)[];
  showSummary?: boolean;
  spanMethod?: (param: SpanMethodProps) =>
    | {
        rowspan: number;
        colspan: number;
      }
    | undefined;
  columns: any;
  fetchData: any;
  selectionChange?: (param: any[]) => void;
  // fetchData: (params?: ReqPage) => Promise<ResPage<any>>;
}>();

const tableData = ref([] as any); // 数据源
const total = ref(0); // 总数据量
const pageSize = ref(10); // 每页显示的数量
const currentPage = ref(1); // 当前页

// 处理每页显示的数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshData();
};

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshData();
};

// 刷新数据
const refreshData = async () => {
  const res = await props.fetchData({
    pageSize: pageSize.value,
    pageNum: currentPage.value
  });
  tableData.value = res.list || [];
  total.value = res.total;
};

// 重置表格数据
const resetData = async () => {
  pageSize.value = 10;
  currentPage.value = 1;
  refreshData();
};

// 在组件创建后获取数据
onMounted(() => {
  refreshData();
});

defineExpose({
  resetData
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
