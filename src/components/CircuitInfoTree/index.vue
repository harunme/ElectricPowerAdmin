<template>
  <div class="CircuitInfoTree">
    <el-tree
      default-expand-all
      style="max-width: 600px"
      :data="tree"
      show-checkbox
      node-key="regionid"
      :default-checked-keys="[100]"
      :props="props"
    />
  </div>
</template>

<script setup lang="tsx" name="CircuitInfoTree">
import { onMounted, ref } from "vue";
import { getCircuitInfoTree } from "@/api/modules/sys";

const tree = ref([] as any);
const props = { children: "children", label: "circuitname" };

onMounted(async () => {
  const res = await getCircuitInfoTree();
  tree.value = res?.data;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
