<template>
  <div class="TransformerSelect">
    <span> 变配电站名称:</span>
    <el-input v-model="input3" style="width: 240px" placeholder="Please input" class="input-with-select">
      <template #append>
        <el-button :icon="Search" @click="dialogVisible = true" />
      </template>
    </el-input>
    <el-dialog v-model="dialogVisible" title="选择变配电站" width="1200" :before-close="handleClose">
      <el-container class="select-modal">
        <el-aside width="280px">
          <el-tabs stretch>
            <el-tab-pane label="组织机构">
              <el-tree
                style="max-width: 600px"
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps"
              />
            </el-tab-pane>
            <el-tab-pane label="区域">Config</el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main class="main">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="变配电站名称" />
            <el-table-column prop="name" label="组织机构" />
            <el-table-column prop="address" label="区域" />
            <el-table-column prop="address" label="用户地址" />
          </el-table>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="TransformerSelect">
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];

const defaultProps = {
  children: "children",
  label: "label"
};
const data = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1"
          },
          {
            id: 10,
            label: "Level three 1-1-2"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1"
      },
      {
        id: 6,
        label: "Level two 2-2"
      }
    ]
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1"
      },
      {
        id: 8,
        label: "Level two 3-2"
      }
    ]
  }
];
const dialogVisible = ref(false);

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
