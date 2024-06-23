<template>
  <div class="PaginationTable">
    <el-table :data="tableData" style="width: 100%">
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="!column.children || column.children.length === 0"
          :key="`column-${index}`"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
        >
          <template v-if="column.prop === 'actions'" #default="scope">
            <slot name="actions" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column v-else :key="`parent-${index}`" :label="column.label" :width="column.width">
          <el-table-column
            v-for="(child, childIndex) in column.children"
            :key="`child-${index}-${childIndex}`"
            :prop="child.prop"
            :label="child.label"
            :width="child.width"
          />
        </el-table-column>
      </template>
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

const props = defineProps<{
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
