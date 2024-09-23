<template>
  <div class="PaginationTable">
    <div class="table">
      <el-table
        height="100%"
        :scrollbar-always-on="true"
        :summary-method="summaryMethod"
        :span-method="spanMethod"
        :show-summary="showSummary"
        @selection-change="selectionChange"
        @row-dblclick="row => rowDbclick && rowDbclick(row)"
        :data="total > 0 || noPagination ? tableData : tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        :row-key="rowKey"
        v-loading="loading"
      >
        <el-table-column v-if="tableData.length !== 0 && selectionChange" type="selection" width="55"></el-table-column>
        <recursive-columns v-for="(item, index) in columns" :key="index" :column="item">
          <template v-for="slotName in Object.keys(slots)" #[slotName]="{ row }">
            <slot :name="slotName" :row="row"></slot>
          </template>
        </recursive-columns>
      </el-table>
    </div>
    <el-pagination
      v-if="!noPagination"
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total > 0 ? total : tableData.length"
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

const loading = ref<boolean>(false);

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
  rowDbclick?: (param: any) => void;
  spanMethod?: (param: SpanMethodProps) =>
    | {
        rowspan: number;
        colspan: number;
      }
    | undefined;
  columns: any;
  fetchData: any;
  selectionChange?: (param: any[]) => void;
  rowKey?: any;
  fetchOnMounted?: any;
  noPagination?: boolean;
  // fetchData: (params?: ReqPage) => Promise<ResPage<any>>;
}>();

const tableData = ref([] as any); // 数据源
const total = ref(0); // 总数据量
const pageSize = ref(10); // 每页显示的数量
const currentPage = ref(1); // 当前页

// 处理每页显示的数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  if (total.value > 0) {
    refreshData();
  } else {
    if (!props.noPagination) {
      pageSize.value = val;
      currentPage.value = 1;
    }
  }
};

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  if (total.value > 0) {
    refreshData();
  }
};

// 刷新数据
const refreshData = async () => {
  try {
    loading.value = true;
    const res = await props.fetchData({
      pageSize: pageSize.value,
      pageNum: currentPage.value
    });
    tableData.value = res?.list || [];
    total.value = res?.total;
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

// 重置表格数据
const resetData = async () => {
  pageSize.value = 10;
  currentPage.value = 1;
  refreshData();
};

// 在组件创建后获取数据
onMounted(() => {
  if (props.fetchOnMounted !== false) refreshData();
});

defineExpose({
  resetData
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
