<template>
  <div class="SubGroup">
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addCircuit">新增区域</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :columns="columns" row-key="regionid" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateRegion(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteRegion(row.regionid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改区域' : '新增区域'" width="500">
      <el-form
        ref="regionFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item required label="区域名称" prop="regionname">
              <el-input v-model="form.regionname" placeholder="最大10个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="上级区域" prop="parentid">
              <el-cascader
                v-model="form.parentid"
                style="width: 100%"
                :options="regionTree"
                :props="{
                  checkStrictly: true,
                  value: 'regionid',
                  label: 'regionname',
                  emitPath: false
                }"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(regionFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="SubGroup">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { getSubGroupTree, insertRegionInfo, deleteRegionById, updateRegionById } from "@/api/modules/org";
import PaginationTable from "@/components/PaginationTable/index.vue";

const defaultForm = {
  regionname: "",
  parentid: undefined
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const regionTree = ref<any>([]);

const isEdit = ref(false);
const regionFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Org.ReqInsertRegionInfo>>({
  regionname: [
    { required: true, message: "请输入区域名称" },
    { max: 10, message: "长度不超过 10 个字符" }
  ],
  parentid: [{ required: true, message: "请选择上级区域" }]
});

const addCircuit = () => {
  isEdit.value = false;
  formVisible.value = true;
  regionFormRef.value?.resetFields();
  setTimeout(() => regionFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "regionname", label: "分组名称" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getSubGroupTree();
    regionTree.value = [{ regionname: "无", regionid: -1 } as any].concat(data);
    resolve({ list: data });
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = { ...form.value };
      if (params.parentid === -1) params.parentid = 0;

      if (isEdit.value) {
        const res = await updateRegionById({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertRegionInfo({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const updateRegion = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, parentid: String(row.parentid) === "0" ? -1 : row.parentid };
  setTimeout(() => regionFormRef.value?.clearValidate());
};

const deleteRegion = async (regionid: string) => {
  const res = await deleteRegionById({ regionid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
