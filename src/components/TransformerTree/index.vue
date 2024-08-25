<template>
  <div class="CircuitInfoTree" v-loading="loading">
    <el-input v-model="search" style="width: 100%; margin-bottom: 8px" placeholder="输入关键字过滤" :suffix-icon="Search" />
    <div style="display: flex; justify-content: center; margin-bottom: 8px">
      <el-checkbox v-if="isMultiple && showCascade" label="级联选择" v-model="checkedCascade" />
      <el-checkbox v-if="isMultiple && showAll" label="全部" v-model="checkedAll" @change="onCheckAll" />
    </div>
    <el-tree
      ref="treeRef"
      default-expand-all
      style="max-width: 600px"
      :data="tree"
      node-key="circuitid"
      :highlight-current="isMultiple ? false : true"
      :expand-on-click-node="isMultiple || false"
      :props="treeProps"
      @node-click="nodeClick"
      @check="handleCheck"
      :show-checkbox="isMultiple"
      :check-strictly="!(checkedCascade && showCascade)"
    />
  </div>
</template>

<script setup lang="tsx" name="CircuitInfoTree">
import { onMounted, ref } from "vue";
import { ElTree } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getCircuitInfoTree } from "@/api/modules/sys";
import { getContextStationId } from "@/utils";

const tree = ref([] as any);
const treeRef = ref<InstanceType<typeof ElTree>>();
const loading = ref<boolean>(false);
const search = ref("");
const checkedCascade = ref<boolean>(true);
const checkedAll = ref<boolean>(true);
const treeProps = { children: "children", label: "circuitname" };

const props = defineProps<{
  onChange?: (param: any) => any;
  showCascade?: boolean;
  showAll?: boolean;
  isMultiple?: boolean;
}>();

const loadTree = async () => {
  loading.value = true;
  const res = await getCircuitInfoTree({
    stationid: getContextStationId()
  });
  tree.value = res?.data;
  loading.value = false;
};
onMounted(async () => {
  await loadTree();
  if (tree.value.length) {
    if (props.isMultiple) onCheckAll(true);
    else nodeClick(tree.value[0]);
  }
});

const nodeClick = (node: any) => {
  if (props.isMultiple) return false;
  if (props.onChange) {
    props.onChange([node.circuitid]);
  }
};

const handleCheck = () => {
  if (props.onChange) {
    props.onChange(treeRef.value!.getCheckedKeys(true));
  }
};

const resetData = async () => {
  loadTree();
};

const onCheckAll = checked => {
  if (checked) {
    let allKeys = [] as string[];
    function getAllKeys(node: any) {
      allKeys.push(node.circuitid);
      if (node.children) {
        node.children.forEach(getAllKeys);
      }
    }

    tree.value.forEach(getAllKeys);
    treeRef.value!.setCheckedKeys(allKeys);
  } else {
    treeRef.value!.setCheckedNodes([]);
  }
  handleCheck();
};

defineExpose({
  resetData
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
