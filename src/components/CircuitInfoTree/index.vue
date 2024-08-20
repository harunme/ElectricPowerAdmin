<template>
  <div class="CircuitInfoTree">
    <el-input v-model="search" style="width: 100%; margin-bottom: 8px" placeholder="输入关键字过滤" :suffix-icon="Search" />
    <el-tree
      default-expand-all
      style="max-width: 600px"
      :data="tree"
      node-key="regionid"
      :default-checked-keys="[100]"
      :highlight-current="true"
      :expand-on-click-node="false"
      :props="treeProps"
      @node-click="nodeClick"
    />
  </div>
</template>

<script setup lang="tsx" name="CircuitInfoTree">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getCircuitInfoTree } from "@/api/modules/sys";
import { getContextStationId } from "@/utils";

const tree = ref([] as any);
const search = ref("");
const treeProps = { children: "children", label: "circuitname" };

const props = defineProps<{
  onChange?: (param: any) => any;
}>();

// http://111.231.24.91/sys/getCircuitInfoTree
onMounted(async () => {
  const res = await getCircuitInfoTree({
    stationid: getContextStationId()
  });
  tree.value = res?.data;
});

const nodeClick = (node: any) => {
  if (props.onChange) {
    props.onChange(node);
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
