<template>
  <div class="DeptTree">
    <el-input
      clearable
      v-model="filterText"
      style="width: 100%; margin-bottom: 8px"
      placeholder="输入关键字过滤"
      :suffix-icon="Search"
    />
    <el-tree
      ref="treeRef"
      default-expand-all
      style="max-width: 600px"
      :data="tree"
      node-key="deptid"
      :highlight-current="true"
      :expand-on-click-node="false"
      :props="treeProps"
      :current-node-key="currentNodeKey"
      @node-click="nodeClick"
      :filter-node-method="filterNode"
    />
  </div>
</template>

<script setup lang="tsx" name="DeptTree">
import { onMounted, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getCompanyTree } from "@/api/modules/org";

interface Tree {
  [key: string]: any;
}

const tree = ref([] as any);
const treeRef = ref<any>(null);
const currentNodeKey = ref(null);
const filterText = ref("");
const treeProps = { children: "children", label: "deptname" };

const props = defineProps<{
  onChange?: (param: any) => any;
}>();

onMounted(async () => {
  const res = await getCompanyTree();
  tree.value = res?.data;
  setTimeout(() => treeRef?.value?.setCurrentKey(res?.data[0]?.deptid));
  if (props.onChange) {
    props.onChange(res?.data[0]);
  }
});

const nodeClick = (node: any) => {
  if (props.onChange) {
    props.onChange(node);
  }
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.deptname.includes(value);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
