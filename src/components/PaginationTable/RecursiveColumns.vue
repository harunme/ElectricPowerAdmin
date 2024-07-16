<template>
  <el-table-column :prop="column?.prop" :label="column?.label" :width="column?.width">
    <template v-if="column?.prop === 'customDom'" #default="{ row }">
      <slot :name="column.slotName" :row="row"></slot>
    </template>
    <template v-if="column?.children">
      <recursive-columns v-for="(item, index) in column.children" :column="item" :key="index">
        <template v-if="!item.children" #[item.slotName]="{ row }">
          <slot name="fIamaxtime" :row="row"></slot>
        </template>
        <template v-for="slotName in Object.keys($slots)" #[slotName]="{ row }">
          <slot :name="slotName" :row="row"></slot>
        </template>
      </recursive-columns>
    </template>
  </el-table-column>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

// const slots = useSlots();

export default defineComponent({
  name: "RecursiveColumns",
  props: {
    column: Object
  }
});
</script>
