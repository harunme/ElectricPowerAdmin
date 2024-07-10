<template>
  <div class="TransformerSelect card">
    <span class="label">当前变配电站:</span>
    <el-tag closable round @close="onSelect" v-if="stationSelected.stationname">{{ stationSelected.stationname }}</el-tag>
    <span v-else class="name">全部站点</span>
    <el-button type="text" :icon="Search" round @click="dialogVisible = true">选择变配电站</el-button>
    <el-dialog v-model="dialogVisible" title="选择变配电站" width="1200" :before-close="handleClose">
      <el-container class="select-modal">
        <el-aside width="280px">
          <el-tabs stretch>
            <el-tab-pane label="组织机构">
              <el-tree
                default-expand-all
                style="max-width: 600px"
                :data="companyTree"
                show-checkbox
                node-key="deptid"
                :default-checked-keys="[100]"
                :props="companyProps"
              />
            </el-tab-pane>
            <el-tab-pane label="区域">
              <el-tree
                default-expand-all
                style="max-width: 600px"
                :data="groupTree"
                show-checkbox
                node-key="regionid"
                :default-checked-keys="[100]"
                :props="groupProps"
              />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main class="main">
          <div class="form">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="关键字">
                <el-input v-model="formInline.user" placeholder="请输入站点名称或编号" clearable />
              </el-form-item>
              <el-form-item>
                <el-button @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <PaginationTable :columns="columns" :fetch-data="fetchData">
            <template #actions="{ row }">
              <el-button type="primary" size="small" @click="onSelect(row)">选择</el-button>
            </template>
          </PaginationTable>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="TransformerSelect">
import { Meter, ReqPage } from "@/api/interface/index";
import { Search } from "@element-plus/icons-vue";
import { getCompanyTree, getSubGroupTree } from "@/api/modules/org";
import { getSubstationListBySubGroupId } from "@/api/modules/meter";
import { ref, watch, reactive } from "vue";
import { localSet, localRemove } from "@/utils";
import PaginationTable from "@/components/PaginationTable/index.vue";

const props = defineProps<{
  onChange?: (param: any) => any;
}>();

// 组织机构树
const companyTree = ref([] as any);
// 区域树
const groupTree = ref([] as any);
// 选择的变配电站
const stationSelected = ref({} as Meter.Station);
// 弹框可见
const dialogVisible = ref(false);
// 表格检索表单
const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

const companyProps = { children: "children", label: "deptname" };
const groupProps = { children: "children", label: "regionname" };

const columns = [
  { prop: "stationid", label: "ID", width: "80px" },
  { prop: "stationname", label: "变配电站名称" },
  { prop: "deptname", label: "组织机构" },
  { prop: "regionname", label: "区域", width: "120px" },
  { prop: "address", label: "用户地址" },
  { prop: "actions", label: "操作", width: "80px" }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<Meter.ResGetSubstationListBySubGroupId> => {
  return new Promise(async resolve => {
    const { data } = await getSubstationListBySubGroupId({
      pageNum,
      pageSize,
      deptid: 100
    });
    resolve(data);
  });
};

const handleClose = () => {
  dialogVisible.value = false;
};

const onSubmit = () => {
  console.log("submit!");
};

const onSelect = (row?: Meter.Station) => {
  if (row) {
    stationSelected.value = row;
    dialogVisible.value = false;
    localSet("context-transformer", row);
  } else {
    stationSelected.value = {} as any;
    localRemove("context-transformer");
  }
  if (props.onChange) props.onChange(row);
};

watch(dialogVisible, async () => {
  if (dialogVisible.value) {
    const getCompanyTreeRes = await getCompanyTree();
    const getSubGroupTreeRes = await getSubGroupTree();
    groupTree.value = getSubGroupTreeRes?.data;
    companyTree.value = getCompanyTreeRes?.data;
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
