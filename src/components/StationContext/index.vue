<template>
  <div class="StationContext card">
    <span class="label">当前变配电站:</span>
    <el-tag :closable="!disableAll" round @close="onSelect" v-if="stationSelected.stationname">{{
      stationSelected.stationname
    }}</el-tag>
    <span v-else class="name">全部站点</span>
    <el-button type="text" :icon="Search" round @click="dialogVisible = true">选择变配电站</el-button>
    <el-dialog v-model="dialogVisible" title="选择变配电站" width="1200" :before-close="handleClose">
      <el-container class="select-modal">
        <el-aside width="280px" style="padding: 0 16px">
          <el-tabs stretch v-model="activeTab">
            <el-tab-pane name="dept" label="组织机构">
              <el-tree
                default-expand-all
                style="max-width: 600px"
                :data="companyTree"
                node-key="deptid"
                :props="companyProps"
                @node-click="nodeClick"
                :highlight-current="true"
                :expand-on-click-node="false"
                :current-node-key="localGet('context-leftselected')?.node?.deptid"
              />
            </el-tab-pane>
            <el-tab-pane name="region" label="区域">
              <el-tree
                default-expand-all
                style="max-width: 600px"
                :data="groupTree"
                node-key="regionid"
                :props="groupProps"
                @node-click="nodeClick"
                :highlight-current="true"
                :expand-on-click-node="false"
                :current-node-key="localGet('context-leftselected')?.node?.regionid"
              />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main class="main">
          <div class="form">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="关键字">
                <el-input style="width: 300px" v-model="formInline.search" placeholder="请输入站点名称或编号" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <PaginationTable :row-dbclick="row => onSelect(row)" ref="tableRef" :columns="columns" :fetch-data="fetchData">
            <template #actions="{ row }">
              <el-button type="primary" size="small" @click="onSelect(row)">选择</el-button>
            </template>
          </PaginationTable>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="StationContext">
import { Meter, ReqPage } from "@/api/interface/index";
import { Search } from "@element-plus/icons-vue";
import { getCompanyTree, getSubGroupTree } from "@/api/modules/org";
import { getSubstationListBySubGroupId } from "@/api/modules/meter";
import { ref, watch, reactive, onMounted } from "vue";
import { localSet, localRemove, localGet, getContextStationId } from "@/utils";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tableRef = ref<any>(null);
const activeTab = ref<any>(localGet("context-leftselected") ? localGet("context-leftselected").active : "dept");
const props = defineProps<{
  disableAll?: boolean;
  onChange?: (param: any) => any;
}>();

// 组织机构树
const companyTree = ref([] as any);
// 区域树
const groupTree = ref([] as any);
// 选择的变配电站
const stationSelected = ref(localGet("context-station") || ({} as Meter.Station));
// 弹框可见
const dialogVisible = ref(false);
// 表格检索表单
const formInline = reactive({
  search: ""
});

const companyProps = { children: "children", label: "deptname" };
const groupProps = { children: "children", label: "regionname" };

const columns = [
  { prop: "stationid", label: "ID", width: 80 },
  { prop: "stationname", label: "变配电站名称" },
  { prop: "deptname", label: "组织机构", width: 92 },
  { prop: "regionname", label: "区域", width: 92 },
  { prop: "address", label: "用户地址" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 80 }
];

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  const hasSelected = localGet("context-leftselected");
  // console.log()
  const params: any = {
    pageNum,
    pageSize
  };
  if (hasSelected) {
    if (hasSelected.active === "region") {
      params.regionid = hasSelected.node.regionid;
    }
    if (hasSelected.active === "dept") {
      params.deptid = hasSelected.node.deptid;
    }
  }
  if (formInline.search) {
    params.search = formInline.search;
  }
  return new Promise(async resolve => {
    const { data } = await getSubstationListBySubGroupId(params);
    if (data) {
      console.log("getContextStationId", getContextStationId());

      resolve(data);
    } else {
      resolve({ list: [], total: 0 });
    }
  });
};

const handleClose = () => {
  dialogVisible.value = false;
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onSelect = (row?: Meter.Station) => {
  if (row) {
    stationSelected.value = row;
    dialogVisible.value = false;
    localSet("context-station", row);
  } else {
    stationSelected.value = {} as any;
    localRemove("context-station");
  }
  if (props.onChange) {
    props.onChange(row);
  }
};

const nodeClick = (node: any) => {
  if (node.regionid) {
    localSet("context-leftselected", { active: "region", node });
  }
  if (node.deptid) {
    localSet("context-leftselected", { active: "dept", node });
  }
  tableRef?.value?.resetData();
};

watch(dialogVisible, async () => {
  if (dialogVisible.value) {
    const getCompanyTreeRes = await getCompanyTree();
    const getSubGroupTreeRes = await getSubGroupTree();
    groupTree.value = getSubGroupTreeRes?.data;
    companyTree.value = getCompanyTreeRes?.data;
  }
});
onMounted(async () => {
  // @ts-expect-error test
  window.SETCONTEXTSTATION = () => (stationSelected.value = localGet("context-station"));
  tableRef?.value?.resetData();
  const getCompanyTreeRes = await getCompanyTree();
  const getSubGroupTreeRes = await getSubGroupTree();

  groupTree.value = getSubGroupTreeRes?.data;
  companyTree.value = getCompanyTreeRes?.data;
  if (props.disableAll && !getContextStationId()) {
    const { data } = await getSubstationListBySubGroupId({ pageNum: 1, pageSize: 10 });
    localSet("context-station", data.list[0]);
    stationSelected.value = data.list[0];
  }

  if (props.onChange) props.onChange(getContextStationId());
});
</script>
<!-- http://111.231.24.91/meter/getSubstationListBySubGroupId -->
<style scoped lang="scss">
@import "./index.scss";
</style>
