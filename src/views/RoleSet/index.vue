<template>
  <div class="RoleSet">
    <CollapseBox />
    <div class="card">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addUserRole">新增角色</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :columns="columns" row-key="roleid" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateUserRole(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteUserRole(row.roleid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
        <el-dialog v-model="formVisible" :title="isEdit ? '修改角色' : '新增角色'" width="500">
          <el-form
            ref="roleFormRef"
            :model="form"
            label-position="right"
            :rules="rules"
            label-width="auto"
            style="padding: 16px 32px"
            :validate-on-rule-change="false"
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item required label="角色名称" prop="rolename">
                  <el-input v-model="form.rolename" placeholder="最大10个中英文字符" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item required label="上级角色" prop="parentid">
                  <el-cascader
                    v-model="form.parentid"
                    style="width: 100%"
                    :options="userRoleTree"
                    :props="{
                      checkStrictly: true,
                      value: 'roleid',
                      label: 'rolename',
                      emitPath: false
                    }"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item required label="组织机构" prop="deptid">
                  <el-cascader
                    v-model="form.deptid"
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
                <el-form-item label="角色说明" prop="roledesc">
                  <el-input v-model="form.roledesc" placeholder="最大30个字符" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="formVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm(roleFormRef)">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="UserGroup">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { getRolesListTree, insertRole, deleteRole, updateRole, getCompanyTree } from "@/api/modules/org";
import PaginationTable from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";

const defaultForm = {
  rolename: "",
  parentid: undefined,
  deptid: undefined,
  roledesc: ""
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const deptTree = ref<any>([]);
const userRoleTree = ref<any>([]);

const isEdit = ref(false);
const roleFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Org.ReqInsertDeptInfo>>({
  rolename: [
    { required: true, message: "请输入角色名称" },
    { max: 30, message: "长度不超过 30 个字符" }
  ],
  parentid: [{ required: true, message: "请选择上级角色" }],
  deptid: [{ required: true, message: "请选择组织机构" }]
});

const addUserRole = () => {
  isEdit.value = false;
  formVisible.value = true;
  roleFormRef.value?.resetFields();
  setTimeout(() => roleFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "rolename", label: "角色名称" },
  { prop: "deptname", label: "组织机构" },
  { prop: "roledesc", label: "角色说明" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getRolesListTree({
      deptid: 100
    });
    userRoleTree.value = [{ rolename: "无", roleid: -1 } as any].concat(data);
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
        const res = await updateRole({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertRole({ ...params });
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

const updateUserRole = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, parentid: String(row.parentid) === "0" ? -1 : row.parentid };
  setTimeout(() => roleFormRef.value?.clearValidate());
};

const deleteUserRole = async (roleid: string) => {
  const res = await deleteRole({ roleid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

onMounted(async () => {
  const { data } = await getCompanyTree();
  deptTree.value = data;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
