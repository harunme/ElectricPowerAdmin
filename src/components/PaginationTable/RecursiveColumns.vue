<template>
  <el-table-column :prop="column?.prop" :label="column?.label" :width="column.width">
    <template v-if="column?.prop === 'actions'" #default="scope">
      <slot name="actions" :row="scope.row"></slot>
    </template>
    <template v-if="column.children">
      <recursive-columns v-for="(item, index) in column.children" :column="item" :key="index"></recursive-columns>
    </template>
  </el-table-column>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RecursiveColumns",
  props: {
    column: Object
  }
});
</script>
