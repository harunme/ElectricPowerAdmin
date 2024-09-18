<template>
  <div class="TransformerTree" v-loading="loading">
    <el-input
      v-if="isMultiple"
      v-model="search"
      style="width: 100%; margin-bottom: 8px"
      placeholder="输入关键字过滤"
      :suffix-icon="Search"
    />
    <el-tree
      v-if="isMultiple"
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
    <div v-else class="single">
      <div v-for="(item, index) in tree" :key="index" @click="onClickTransformer(item)">
        <img :src="singleSelected?.transformerid === item.transformerid ? TransformerSelectedImg : TransformerNotSelectedImg" />
        <span>{{ item.transformername }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="TransformerTree">
import { ref } from "vue";
import { ElTree } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getTransformerInfo } from "@/api/modules/meter";
import { getContextStationId } from "@/utils";
import TransformerNotSelectedImg from "@/assets/images/transform-notselected.png";
import TransformerSelectedImg from "@/assets/images/transform-selected.png";

const tree = ref([] as any);
const treeRef = ref<InstanceType<typeof ElTree>>();
const loading = ref<boolean>(false);
const search = ref("");
const singleSelected = ref<any>(null);

const treeProps = { children: "children", label: "transformername" };

const props = defineProps<{
  onChange?: (param: any, fullParam?: any) => any;
  isMultiple?: boolean;
}>();

const loadTree = async () => {
  loading.value = true;
  const params: any = {};
  if (getContextStationId()) params.stationid = getContextStationId();
  const res = await getTransformerInfo(params);
  if (props.isMultiple) tree.value = [{ transformername: "全部", transformerid: 0, children: res?.data || [] }];
  else tree.value = res?.data || [];
  loading.value = false;
};

const handleCheck = () => {
  if (props.onChange) {
    if (props.isMultiple) props.onChange(treeRef.value!.getCheckedKeys(true), treeRef.value!.getCheckedNodes(true));
    else props.onChange([singleSelected.value.transformerid], [singleSelected.value]);
  }
};

const resetData = async () => {
  await loadTree();
  if (tree.value.length) {
    if (props.isMultiple) {
      onCheckAll(true);
    } else {
      singleSelected.value = tree.value[0];
      handleCheck();
    }
  }
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

const onClickTransformer = value => {
  singleSelected.value = value;
  if (props.onChange) {
    props.onChange([singleSelected.value.transformerid], [singleSelected.value]);
  }
};

defineExpose({
  resetData
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
