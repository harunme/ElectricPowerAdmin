<template>
  <div class="PaginationTable">
    <el-table :data="tableData" style="width: 100%">
      <recursive-columns v-for="(item, index) in columns" :key="index" :column="item">
        <template #actions="{ row }">
          <slot name="actions" :row="row"></slot>
        </template>
      </recursive-columns>
    </el-table>
    <el-pagination
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
import { ref, onMounted } from "vue";
import { ReqPage, ResPage } from "@/api/interface/index";
import RecursiveColumns from "./RecursiveColumns.vue";
import type { TableColumnCtx } from "element-plus";

export interface SpanMethodProps {
  row: any;
  column: TableColumnCtx<any>;
  rowIndex: number;
  columnIndex: number;
}

const props = defineProps<{
  spanMethod: (param: SpanMethodProps) => number[];
  columns: Array<{ prop?: string; label: string; width?: string; children?: { prop: string; label: string; width?: string }[] }>;
  fetchData: (params: ReqPage) => Promise<ResPage<any>>;
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
  tableData.value = res.list;
  total.value = res.total;
};

// 在组件创建后获取数据
onMounted(() => {
  refreshData();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
