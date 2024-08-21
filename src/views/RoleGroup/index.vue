<template>
  <div class="RoleGroup">
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addDept">新增组织机构</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :columns="columns" row-key="deptid" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateDept(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteDept(row.deptid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改组织机构' : '新增组织机构'" width="500">
      <el-form
        ref="deptFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item required label="组织机构名称" prop="deptname">
              <el-input v-model="form.deptname" placeholder="最大10个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="上级组织机构" prop="parentid">
              <el-cascader
                v-model="form.parentid"
                style="width: 100%"
                :options="deptTree"
                :props="{
                  checkStrictly: true,
                  value: 'deptid',
                  label: 'deptname',
                  emitPath: false
                }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信用编码" prop="code">
              <el-input v-model="form.code" placeholder="最大30个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="最大30个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可接入变配电站个数" prop="stationnum">
              <el-input-number v-model="form.stationnum" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可接入仪表个数" prop="meternum">
              <el-input-number v-model="form.meternum" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(deptFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="RoleGroup">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { getCompanyTree, insertDeptInfo, deleteDeptById, updateDeptById } from "@/api/modules/org";
import PaginationTable from "@/components/PaginationTable/index.vue";

const defaultForm = {
  deptname: "",
  parentid: undefined,
  code: "",
  address: "",
  stationnum: 0,
  meternum: 0
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const deptTree = ref<any>([]);

const isEdit = ref(false);
const deptFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Org.ReqInsertDeptInfo>>({
  deptname: [
    { required: true, message: "请输入组织机构名称" },
    { max: 10, message: "长度不超过 10 个字符" }
  ],
  code: [{ max: 30, message: "长度不超过 30 个字符" }],
  address: [{ max: 30, message: "长度不超过 30 个字符" }],
  parentid: [{ required: true, message: "请选择上级组织机构" }]
});

const addDept = () => {
  isEdit.value = false;
  formVisible.value = true;
  deptFormRef.value?.resetFields();
  setTimeout(() => deptFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "deptname", label: "组织机构名称" },
  { prop: "code", label: "信用编码" },
  { prop: "address", label: "地址" },
  { prop: "meternum", label: "可接入变配电站个数" },
  { prop: "stationnum", label: "可接入仪表个数" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getCompanyTree();
    deptTree.value = [{ deptname: "无", deptid: -1 } as any].concat(data);
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
        const res = await updateDeptById({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertDeptInfo({ ...params });
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

const updateDept = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, parentid: String(row.parentid) === "0" ? -1 : row.parentid };
  setTimeout(() => deptFormRef.value?.clearValidate());
};

const deleteDept = async (deptid: string) => {
  const res = await deleteDeptById({ deptid });
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
