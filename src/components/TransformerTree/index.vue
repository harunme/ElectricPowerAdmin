<template>
  <div class="CircuitInfoTree" v-loading="loading">
    <el-input v-model="search" style="width: 100%; margin-bottom: 8px" placeholder="输入关键字过滤" :suffix-icon="Search" />

    <el-tree
      ref="treeRef"
      default-expand-all
      style="max-width: 600px"
      :data="tree"
      node-key="transformerid"
      :expand-on-click-node="false"
      :props="treeProps"
      @check="handleCheck"
      :show-checkbox="true"
    />
  </div>
</template>

<script setup lang="tsx" name="CircuitInfoTree">
import { onMounted, ref } from "vue";
import { ElTree } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getTransformerInfo } from "@/api/modules/meter";
import { getContextStationId } from "@/utils";

const tree = ref([] as any);
const treeRef = ref<InstanceType<typeof ElTree>>();
const loading = ref<boolean>(false);
const search = ref("");

const treeProps = { children: "children", label: "transformername" };

const props = defineProps<{
  onChange?: (param: any) => any;

  isMultiple?: boolean;
}>();

const loadTree = async () => {
  loading.value = true;
  const res = await getTransformerInfo({
    stationid: getContextStationId()
  });

  tree.value = [{ transformername: "全部", transformerid: 0, children: res?.data }];
  loading.value = false;
};
onMounted(async () => {
  await loadTree();
  if (tree.value.length) {
    onCheckAll(true);
  }
});

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
